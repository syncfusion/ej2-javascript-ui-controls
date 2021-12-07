/**
 * Test case for dataManager
 */
import {DataManager} from '../src/manager';
import {DataUtil} from '../src/util';
import {Query, Predicate} from '../src/query';

describe('Query', () => {
    describe('Query generated properly without queries', () => {
        let query: Query = new Query();
        it('To check length of generated data.', () => {
            expect(query.queries.length).toBe(0);
        });
    });
    describe('Query operation in JSON data', () => {
        let data: JSON[] = ([
            { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
            { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
            { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
            { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63 },
            { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45 }
        ]as Object) as JSON[];
        let dataManager: DataManager = new DataManager(data);
        let query: Query = new Query();
        describe('JSON data is generated properly', () => {
            let result: Object[] = query.executeLocal(dataManager);
            it('To check length of generated data.', () => {
                expect(result.length).toBe(data.length);
            });
        });
        describe('setKey method', () => {
            it('To check key in queries.', () => {
                expect(query["key"]).toBe('');
                query.setKey('OrderID');
                expect(query["key"]).toBe('OrderID');
            });
        });
        describe('using method', () => {
            let dm: DataManager;
            let result: Object[];
            it('To check datamanager is empty on initial.', () => {
                expect(query.dataManager === undefined).toBe(true);
            });
            it('To check length of generated data.', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length);
            });
            it('To check datamanager is changed as new.', () => {
                dm = new DataManager(([{ OrderID: 10251, CustomerID: 'TOMSP', EmployeeID: 7, Freight: 70.63 }]as Object) as JSON[]);
                query.using(dm);
                expect(query.dataManager).toEqual(dm);
            });
            it('To check length of data from new datamanager.', () => {
                result = query.executeLocal();
                expect(result.length).toEqual(1);
            });
        });
        describe('execute method', () => {
            let result: Object[];
            beforeAll((done: Function) => {
                let dataManager: DataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/'
                });
                let query: Query = new Query().select(['OrderID', 'CustomerID', 'ShipName']).take(3);
                let promise: Promise<Object> = query.execute(dataManager);
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check length of the generated data.', () => {
                expect(result.length).toBe(3);
            });
            it('To check the result key is equal to select query.', () => {
                expect(Object.keys(result[0])).toEqual(['OrderID', 'CustomerID', 'ShipName']);
            });
            it('To check without dataManager.', () => {
                expect(() => { new Query().execute(); }).toThrow();
            });
        });
        describe('executeLocal method', () => {
            it('To check the generated data.', () => {
                let result: Object[] = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length);
            });
            it('To check without dataManager.', () => {
                expect(() => { new Query().executeLocal(); }).toThrow();
            });
        });
        describe('clone method', () => {
            query = new Query().select(['OrderID', 'CustomerID', 'Freight']);
            let result: Object[] = query.executeLocal(dataManager);
            let clonedQuery: Query = query.clone();
            let clonedResult: Object[] = clonedQuery.executeLocal(dataManager);
            it('To check query cloned properly.', () => {
                expect(clonedQuery instanceof Query).toBe(true);
            });
            it('To check data from cloned query.', () => {
                expect(result).toEqual(clonedResult);
            });
        });
        describe('from method', () => {
            it('To check data in from query.', () => {
                query = new Query().from('Orders');
                let result: Object[] = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length);
            });
        });
        describe('from in constructor', () => {
            it('To check data using string param.', () => {
                query = new Query('Orders');
                let result: Object[] = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length);
            });
            it('To check data using array param.', () => {
                query = new Query(['Orders']);
                let result: Object[] = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length);
            });
        });
        describe('addParams method', () => {
            it('To check string params.', () => {
                query = new Query().addParams('key1', 'Success');
                expect(query.params[0]["key"]).toEqual('key1');
                expect(query.params[0].value).toEqual('Success');
            });

            it('To check function params.', () => {
                query = query.addParams('key2', () => {/* */ });
                expect(query.params[1]["key"]).toEqual('key2');
                expect(typeof query.params[1].fn).toBe('function');
            });
        });
        describe('expand method', () => {
            it('To check string for expand.', () => {
                query = new Query().expand('OrderDetails');
                expect(query.expands[0]).toEqual('OrderDetails');
            });
            it('To check Object for expand.', () => {
                let arrayData: Object[] = [{
                    OrderDetails: [{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 }]
                }, {
                        EmployeeDetails: [{ EmployeeID: 10248, FirstName: 'Jhon', LastName: 'Joe' }]
                    }];
                query = new Query().expand(arrayData);
                expect(query.expands[0]).toEqual(arrayData[0]);
            });
        });
        describe('where method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().where('CustomerID', 'equal', 'VINET');
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "where".', () => {
                expect(query.queries[0].fn).toEqual('onWhere');
            });
            it('To check filtered data length".', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(2);
            });
            it('To check filtered properly".', () => {
                result = query.executeLocal(dataManager);
                expect(result[0]["CustomerID"]).toEqual('VINET');
                expect(result[1]["CustomerID"]).toEqual('VINET');
            });
            it('To check null param".', () => {
                dataManager = new DataManager(data);
                query = new Query().where(null);
                result = query.executeLocal(dataManager);
                expect(result.length).toEqual(0);
            });
        });
        describe('search method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().search(7, 'EmployeeID', 'equal');
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "search".', () => {
                expect(query.queries[0].fn).toEqual('onSearch');
            });
            it('To check filtered properly".', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(2);
            });
            it('To check filtered properly".', () => {
                result = query.executeLocal(dataManager);
                expect(result[0]["EmployeeID"]).toEqual(7);
                expect(result[1]["EmployeeID"]).toEqual(7);
            });
            it('To check field name as array type.', () => {
                dataManager = new DataManager(data);
                query = new Query().search(7, ['EmployeeID'], 'equal');
                expect(query.queries.length).toEqual(1);
            });
            it('To check without operators.', () => {
                dataManager = new DataManager(data);
                query = new Query().search(7, 'EmployeeID');
                expect(query.queries.length).toEqual(1);
            });
        });
        describe('sortBy method', () => {
            let result: Object[];
            describe('descending', () => {
                it('To check queries added.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy('Freight', 'descending');
                    expect(query.queries.length).toEqual(1);
                });
                it('To check added queries as "sortBy".', () => {
                    expect(query.queries[0].fn).toEqual('onSortBy');
                });
                it('To check direction of "sortBy".', () => {
                    expect(query.queries[0].e.direction).toEqual('descending');
                });
                it('To check sorted data legnth.', () => {
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(data.length);
                });
                it('To check sorted properly".', () => {
                    expect(result[0]["Freight"] > result[1]["Freight"]).toBe(true);
                    expect(result[1]["Freight"] > result[2]["Freight"]).toEqual(true);
                    expect(result[3]["Freight"] > result[4]["Freight"]).toEqual(true);
                });
                it('To check with group enabled.', () => {
                    query = new Query().sortBy('CustomerID', 'descending', true);
                    expect(query.queries.length).toEqual(1);
                });
            });
            describe('sortBy method with desc keyword', () => {
                let result: Object[];
                describe('descending', () => {
                    it('To check queries added.', () => {
                        dataManager = new DataManager(data);
                        query = new Query().sortBy('Freight desc');
                        expect(query.queries.length).toEqual(1);
                    });
                    it('To check added queries as "sortBy".', () => {
                        expect(query.queries[0].fn).toEqual('onSortBy');
                    });
                    it('To check direction of "sortBy".', () => {
                        expect(query.queries[0].e.direction).toEqual('descending');
                    });
                    it('To check sorted data legnth.', () => {
                        result = query.executeLocal(dataManager);
                        expect(result.length).toBe(data.length);
                    });
                    it('To check sorted properly".', () => {
                        expect(result[0]["Freight"] > result[1]["Freight"]).toBe(true);
                        expect(result[1]["Freight"] > result[2]["Freight"]).toEqual(true);
                        expect(result[3]["Freight"] > result[4]["Freight"]).toEqual(true);
                    });
                    it('To check with group enabled.', () => {
                        query = new Query().sortBy('Freight', 'descending', true);
                        expect(query.queries.length).toEqual(1);
                    });
                });
            });
            describe('descending', () => {
                it('To check queries added.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy('Freight', 'ascending');
                    expect(query.queries.length).toEqual(1);
                });
                it('To check added queries as "sortBy".', () => {
                    expect(query.queries[0].fn).toEqual('onSortBy');
                });
                it('To check direction of "sortBy".', () => {
                    expect(query.queries[0].e.direction).toEqual('ascending');
                });
                it('To check sorted data legnth.', () => {
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(data.length);
                });
                it('To check sorted properly".', () => {
                    expect(result[0]["Freight"] < result[1]["Freight"]).toBe(true);
                    expect(result[1]["Freight"] < result[2]["Freight"]).toEqual(true);
                    expect(result[3]["Freight"] < result[4]["Freight"]).toEqual(true);
                });
                it('To check with group enabled.', () => {
                    query = new Query().sortBy('Freight', 'descending', true);
                    expect(query.queries.length).toEqual(1);
                });
            });
            describe('multi sorting', () => {
                it('To check queries added.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy('CustomerID', 'ascending', true).sortBy('EmployeeID', 'descending', true);
                    expect(query.queries.length).toEqual(2);
                });
                it('To check added queries as "sortBy".', () => {
                    expect(query.queries[0].fn).toEqual('onSortBy');
                    expect(query.queries[1].fn).toEqual('onSortBy');
                });
                it('To check direction of "sortBy".', () => {
                    expect(query.queries[0].e.direction).toEqual('ascending');
                    expect(query.queries[1].e.direction).toEqual('descending');
                });
                it('To check fieldNames of "sortBy".', () => {
                    expect(query.queries[0].e.fieldName).toEqual('CustomerID');
                    expect(query.queries[1].e.fieldName).toEqual('EmployeeID');
                });
                it('To check sorted data legnth.', () => {
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(data.length);
                });
                it('To check sorted properly".', () => {
                    expect(result[0]["EmployeeID"] >= result[1]["EmployeeID"]).toBe(true);
                    expect(result[1]["EmployeeID"] >= result[2]["EmployeeID"]).toEqual(true);
                    expect(result[3]["EmployeeID"] >= result[4]["EmployeeID"]).toEqual(true);
                });
                it('multi sorting with same fieldName.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy('CustomerID', 'descending', true).sortBy('CustomerID', 'ascending', true);
                    expect(query.queries.length).toEqual(1);
                });
                it('multi sorting with null fieldName.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy(null, 'descending', true).sortBy('CustomerID', 'ascending', true);
                    expect(query.queries.length).toEqual(2);
                });
                it('multi sorting with array of fieldName.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy(['CustomerID'], 'descending', true).sortBy('EmployeeID', 'ascending', true);
                    expect(query.queries.length).toEqual(2);
                });
                it('multi sorting with array of fieldNames as same.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy(['CustomerID'], 'descending', true).sortBy('CustomerID', 'ascending', true);
                    expect(query.queries.length).toEqual(1);
                });
            });
            describe('multi sorting with string field', () => {
                it('To check queries added.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().sortBy('CustomerID', 'descending', true).sortBy('EmployeeID', 'ascending', true);
                    expect(query.queries.length).toEqual(2);
                });
                it('To check added queries as "sortBy".', () => {
                    expect(query.queries[0].fn).toEqual('onSortBy');
                    expect(query.queries[1].fn).toEqual('onSortBy');
                });
                it('To check direction of "sortBy".', () => {
                    expect(query.queries[1].e.direction).toEqual('ascending');
                    expect(query.queries[0].e.direction).toEqual('descending');
                });
                it('To check fieldNames of "sortBy".', () => {
                    expect(query.queries[0].e.fieldName).toEqual('CustomerID');
                    expect(query.queries[1].e.fieldName).toEqual('EmployeeID');
                });
                it('To check sorted data legnth.', () => {
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(data.length);
                });
                it('To check sorted properly".', () => {
                    expect(result[0]["EmployeeID"] <= result[1]["EmployeeID"]).toBe(true);
                    expect(result[1]["EmployeeID"] <= result[2]["EmployeeID"]).toEqual(true);
                    expect(result[3]["EmployeeID"] <= result[4]["EmployeeID"]).toEqual(true);
                });
            });
        });
        describe('sortByDesc method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().sortByDesc('Freight');
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "sortBy".', () => {
                expect(query.queries[0].fn).toEqual('onSortBy');
            });
            it('To check direction of "sortBy".', () => {
                expect(query.queries[0].e.direction).toEqual('descending');
            });
            it('To check sorted data legnth.', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length);
            });
            it('To check sorted properly".', () => {
                expect(result[0]["Freight"] > result[1]["Freight"]).toBe(true);
                expect(result[1]["Freight"] > result[2]["Freight"]).toEqual(true);
                expect(result[3]["Freight"] > result[4]["Freight"]).toEqual(true);
            });
        });
        describe('group method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().group('EmployeeID');
                expect(query.queries.length).toEqual(2);
            });
            it('To check added queries as "sortBy" and "group".', () => {
                expect(query.queries[0].fn).toEqual('onSortBy');
                expect(query.queries[1].fn).toEqual('onGroup');
            });
            it('To check direction of "sortBy".', () => {
                expect(query.queries[0].e.direction).toEqual('ascending');
            });
            it('To check grouped data.', () => {
                result = query.executeLocal(dataManager);
                expect(result[3]["items"].length).toBe(2);
                expect(result[3]["key"] === 7).toBe(true);
            });
            it('To check grouped field.', () => {
                expect(result[3]["field"] === 'EmployeeID').toBe(true);
            });
        });
        describe('page method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().page(1, 3);
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "page".', () => {
                expect(query.queries[0].fn).toEqual('onPage');
            });
            it('To check size and index.', () => {
                expect(query.queries[0].e.pageIndex).toEqual(1);
                expect(query.queries[0].e.pageSize).toEqual(3);
            });
            it('To check paged data legnth.', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(3);
            });
        });
        describe('range method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().range(3, 4);
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "range".', () => {
                expect(query.queries[0].fn).toEqual('onRange');
            });
            it('To check index of range.', () => {
                expect(query.queries[0].e.start).toEqual(3);
                expect(query.queries[0].e.end).toEqual(4);
            });
            it('To check range data legnth.', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(1);
            });
            it('To check range data.', () => {
                expect(result[0]).toEqual(data[3]);
            });
        });
        describe('skip method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().skip(2);
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "skip".', () => {
                expect(query.queries[0].fn).toEqual('onSkip');
            });
            it('To check skip data legnth.', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(data.length - 2);
            });
            it('To check skip data.', () => {
                expect(result[0]).toEqual(data[2]);
            });
        });
        describe('take method', () => {
            let result: Object[];
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().take(3);
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "take".', () => {
                expect(query.queries[0].fn).toEqual('onTake');
            });
            it('To check take data legnth.', () => {
                result = query.executeLocal(dataManager);
                expect(result.length).toBe(3);
            });
            it('To check take data.', () => {
                expect(result[0]).toEqual(data[0]);
            });
        });
        describe('aggregate method', () => {
            let result: Object;
            it('To check queries added.', () => {
                dataManager = new DataManager(data);
                query = new Query().aggregate('sum', 'Freight').requiresCount();
                expect(query.queries.length).toEqual(1);
            });
            it('To check added queries as "aggregates".', () => {
                expect(query.queries[0].fn).toEqual('onAggregates');
            });
            it('To check field and type.', () => {
                expect(query.queries[0].e["field"]).toBe('Freight');
                expect(query.queries[0].e.type).toBe('sum');
            });
            it('To check take data legnth.', () => {
                result = query.executeLocal(dataManager);
                expect((<{ aggregates: { [key: string]: number } }>result).aggregates['Freight - sum']).toBe(225.89999999999998);
            });
        });
        describe('select method', () => {
            let result: Object[];
            describe('Array params', () => {
                it('To check queries added.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().select(['OrderID', 'CustomerID', 'Freight']);
                    expect(query.queries.length).toEqual(1);
                });
                it('To check added queries as "select".', () => {
                    expect(query.queries[0].fn).toEqual('onSelect');
                });
                it('To check selected fieldNames legnth.', () => {
                    expect(query.queries[0].e.fieldNames.length).toBe(3);
                });
                it('To check selected fieldNames.', () => {
                    expect(query.queries[0].e.fieldNames[0]).toBe('OrderID');
                    expect(query.queries[0].e.fieldNames[1]).toBe('CustomerID');
                    expect(query.queries[0].e.fieldNames[2]).toBe('Freight');
                });
                it('To check selected data.', () => {
                    result = query.executeLocal(dataManager);
                    expect(result[0]).not.toBe(data[0]);
                });
                it('To check keys of selected data.', () => {
                    let keys: string[] = Object.keys(result[0]);
                    expect(keys[0]).toBe('OrderID');
                    expect(keys[1]).toBe('CustomerID');
                    expect(keys[2]).toBe('Freight');
                });
            });
            describe('String Paramas', () => {
                it('To check queries added.', () => {
                    dataManager = new DataManager(data);
                    query = new Query().select('OrderID');
                    expect(query.queries.length).toEqual(1);
                });
                it('To check added queries as "select".', () => {
                    expect(query.queries[0].fn).toEqual('onSelect');
                });
                it('To check selected fieldNames legnth.', () => {
                    expect(query.queries[0].e.fieldNames.length).toBe(1);
                });
                it('To check selected fieldNames.', () => {
                    expect(query.queries[0].e.fieldNames[0]).toBe('OrderID');
                });
                it('To check selected data.', () => {
                    result = query.executeLocal(dataManager);
                    expect(result[0]).not.toBe(data[0]);
                });
                it('To check keys of selected data.', () => {
                    expect(result[0].toString()).toBe({"OrderID": data[0]['OrderID']}.toString());
                    expect(result[4].toString()).toBe({"OrderID": data[4]['OrderID']}.toString());
                });
            });
        });
        describe('foreignKey method', () => {
            it('To check added queries.', () => {
                dataManager = new DataManager(data);
                query = new Query().foreignKey('Orders');
                expect(query.fKey).toEqual('Orders');
            });
        });
        describe('requiresCount method', () => {
            it('To check added queries.', () => {
                dataManager = new DataManager(data);
                expect(query.isCountRequired).toBeUndefined();
                query = new Query().requiresCount();
                expect(query.isCountRequired).toBe(true);
            });
        });
        describe('filtering operations', () => {
            describe('for lessThan', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'lessThan', 10250, false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID < 10250).toBe(true);
                    expect(result[1].OrderID < 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('lessthan');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for greaterThan', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'greaterThan', 10250, false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID > 10250).toBe(true);
                    expect(result[1].OrderID > 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('greaterthan');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for greaterThan with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'greaterThan', 10250, true);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID > 10250).toBe(true);
                    expect(result[1].OrderID > 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('greaterthan');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for greaterThan using symbols', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', '>', 10250, false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID > 10250).toBe(true);
                    expect(result[1].OrderID > 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('>');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for lessThanOrEqual', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'lessThanOrEqual', 10250, false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID < 10250).toBe(true);
                    expect(result[1].OrderID < 10250).toBe(true);
                    expect(result[2].OrderID === 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('lessthanorequal');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for invalid symbols in operator', () => {
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(() => { new Query().where('OrderID', '$', 10250, false); }).toThrow();
                });
            });
            describe('for lessThanOrEqual with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'lessThanOrEqual', 10250, true);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID < 10250).toBe(true);
                    expect(result[1].OrderID < 10250).toBe(true);
                    expect(result[2].OrderID === 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('lessthanorequal');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for greaterThanOrEqual', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'greaterThanOrEqual', 10250, false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID === 10250).toBe(true);
                    expect(result[1].OrderID > 10250).toBe(true);
                    expect(result[2].OrderID > 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('greaterthanorequal');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for greaterThanOrEqual with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('OrderID', 'greaterThanOrEqual', 10250, true);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID === 10250).toBe(true);
                    expect(result[1].OrderID > 10250).toBe(true);
                    expect(result[2].OrderID > 10250).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('greaterthanorequal');
                    expect(query.queries[0].e.value).toEqual(10250);
                    expect(query.queries[0].e["field"]).toEqual('OrderID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for equal', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'equal', 'VINET', false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0]["CustomerID"] === 'VINET').toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('equal');
                    expect(query.queries[0].e.value).toEqual('VINET');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for notEqual', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'notEqual', 'VINET', false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0]["CustomerID"] !== 'VINET').toBe(true);
                    expect(result[1]["CustomerID"] !== 'VINET').toBe(true);
                    expect(result[2]["CustomerID"] !== 'VINET').toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('notequal');
                    expect(query.queries[0].e.value).toEqual('VINET');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for contains', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'contains', 'VI', false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[1]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[2]["CustomerID"], 'VI')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('contains');
                    expect(query.queries[0].e.value).toEqual('VI');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for contains with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'contains', 'VI', true);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[1]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[2]["CustomerID"], 'VI')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('contains');
                    expect(query.queries[0].e.value).toEqual('VI');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for startsWith with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'startsWith', 'VI', false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[1]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[2]["CustomerID"], 'VI')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('startswith');
                    expect(query.queries[0].e.value).toEqual('VI');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for startsWith with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'startsWith', 'VI', true);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[1]["CustomerID"], 'VI')).toBe(true);
                    expect(DataUtil.startsWith(result[2]["CustomerID"], 'VI')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('startswith');
                    expect(query.queries[0].e.value).toEqual('VI');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for endsWith', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'endsWith', 'ET', false);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.endsWith(result[0]["CustomerID"], 'ET')).toBe(true);
                    expect(DataUtil.endsWith(result[1]["CustomerID"], 'ET')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('endswith');
                    expect(query.queries[0].e.value).toEqual('ET');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for endsWith with ignorecase', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    query = new Query().where('CustomerID', 'endsWith', 'ET', true);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.endsWith(result[0]["CustomerID"], 'ET')).toBe(true);
                    expect(DataUtil.endsWith(result[1]["CustomerID"], 'ET')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.operator).toEqual('endswith');
                    expect(query.queries[0].e.value).toEqual('ET');
                    expect(query.queries[0].e["field"]).toEqual('CustomerID');
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('for and predicate', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    let predicate: Predicate = new Predicate('OrderID', 'lessThan', 10251, true).
                        and('CustomerID', 'startsWith', 'VI', true);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data length.', () => {
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(result[0].OrderID < 10251).toBe(true);
                    expect(result[1].OrderID < 10251).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.condition).toEqual('and');
                    expect(query.queries[0].e.predicates.length).toEqual(2);
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
                it('To check field name as predicate.', () => {
                    let pred: Predicate = new Predicate('CustomerID', 'startsWith', 'VI', true);
                    let predicate: Predicate = new Predicate('OrderID', 'lessThan', 10251, true).and(pred);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(2);
                });
            });
            describe('for or predicate', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    let predicate: Predicate = new Predicate('OrderID', 'lessThan', 10251, true).
                        or('CustomerID', 'startsWith', 'VI', true);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data length.', () => {
                    expect(result.length).toBe(4);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID < 10251 || DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(result[1].OrderID < 10251 || DataUtil.startsWith(result[1]["CustomerID"], 'VI')).toBe(true);
                    expect(result[2].OrderID < 10251 || DataUtil.startsWith(result[2]["CustomerID"], 'VI')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.condition).toEqual('or');
                    expect(query.queries[0].e.predicates.length).toEqual(2);
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
                it('To check null field name.', () => {
                    expect(() => { new Predicate('OrderID', 'lessThan', 10251, true).or(null, 'startsWith', 'VI', true); }).toThrow();
                });
                it('To check field name as predicate.', () => {
                    let pred: Predicate = new Predicate('CustomerID', 'startsWith', 'VI', true);
                    let predicate: Predicate = new Predicate('OrderID', 'lessThan', 10251, true).or(pred);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(4);
                });
            });
            describe('for array of predicate', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    let pred: Predicate = new Predicate('CustomerID', 'startsWith', 'VI', false);
                    let predicate: Predicate = new Predicate(
                        pred, 'lessThan', [new Predicate('CustomerID', 'startsWith', 'VI', false)]).
                        or('CustomerID', 'startsWith', 'VI', true);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check data filtered properly.', () => {
                    expect(result[0].OrderID < 10251 || DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(result[1].OrderID < 10251 || DataUtil.startsWith(result[1]["CustomerID"], 'VI')).toBe(true);
                    expect(result[2].OrderID < 10251 || DataUtil.startsWith(result[2]["CustomerID"], 'VI')).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.condition).toEqual('or');
                    expect(query.queries[0].e.predicates.length).toEqual(2);
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
                it('To check predicate field as null.', () => {
                    dataManager = new DataManager(data);
                    let predicate: Predicate = new Predicate(null, 'equal', 10248);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(0);
                });
            });
            describe('for json to predicate conversion', () => {
                let result: any;
                let parsedPred: Predicate;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    let predicate: Predicate = new Predicate('OrderID', 'lessThan', 10251, true).
                        and('CustomerID', 'startsWith', 'VI', true);
                    let strPred: string = JSON.stringify(predicate);
                    parsedPred = JSON.parse(strPred);
                    query = new Query().where(parsedPred);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(0);
                });
                it('To check filtered data after parsed from json.', () => {
                    let formJson: Predicate[] = Predicate.fromJson(parsedPred);
                    query = new Query().where(formJson);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(result[0].OrderID < 10251).toBe(true);
                    expect(result[1].OrderID < 10251).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.condition).toEqual('and');
                    expect(query.queries[0].e.predicates.length).toEqual(2);
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
                it('To check filtered data after parsed from json.', () => {
                    let formJson: Predicate[] = Predicate.fromJson([parsedPred]);
                    query = new Query().where(formJson[0]);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(2);
                });
            });
            describe('for array of json to predicate conversion', () => {
                let result: any;
                let parsedPred: Predicate;
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    let predicate: Predicate = new Predicate('OrderID', 'lessThan', 10251, true).
                        and('CustomerID', 'startsWith', 'VI', true);
                    let strPred: string = JSON.stringify(predicate);
                    parsedPred = JSON.parse(strPred);
                    query = new Query().where(parsedPred);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check filtered data legnth.', () => {
                    expect(result.length).toBe(0);
                });
                it('To check filtered data after parsed from json.', () => {
                    let formJson: Predicate[] = Predicate.fromJson([parsedPred]);
                    query = new Query().where(formJson[0]);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(2);
                });
                it('To check data filtered properly.', () => {
                    expect(DataUtil.startsWith(result[0]["CustomerID"], 'VI')).toBe(true);
                    expect(result[0].OrderID < 10251).toBe(true);
                    expect(result[1].OrderID < 10251).toBe(true);
                });
                it('To check the query added properly.', () => {
                    expect(query.queries[0].e.condition).toEqual('and');
                    expect(query.queries[0].e.predicates.length).toEqual(2);
                    expect(query.queries[0].fn).toEqual('onWhere');
                });
            });
            describe('Predicate check', () => {
                beforeAll((done: Function) => {
                    dataManager = new DataManager(data);
                    done();
                });
                it('To check the static and function.', () => {
                    let pred: Predicate = Predicate.and(new Predicate('OrderID', 'equal', 10248));
                    query = new Query().where(pred);
                    let result: Object[] = query.executeLocal(dataManager);
                    expect(result.length).toBe(1);
                });
                it('To check the static or function.', () => {
                    let pred: Predicate = Predicate.or(new Predicate('OrderID', 'equal', 10248));
                    query = new Query().where(pred);
                    let result: Object[] = query.executeLocal(dataManager);
                    expect(result.length).toBe(1);
                });
            });
            describe('to check in predicate', () => {
                let result: any;
                beforeAll((done: Function) => {
                    dataManager = new DataManager([{a: 'Áèèleè', b:'Diacritic Character' }, {a: 'Vinet', b: 'Normal Character'}]);
                    let predicate: Predicate = new Predicate('a', 'equal', 'Aeelee', true, true).
                        and('b', 'equal', 'Diacritic Character', true, true);
                    query = new Query().where(predicate);
                    result = query.executeLocal(dataManager);
                    done();
                });
                it('To check the complex predicate.', () => {
                    let pred: Predicate = new Predicate('a', 'equal', 'aeelee', true, true);
                    let predicate: Predicate = new Predicate('b', 'equal', 'Diacritic Character', true, true).and(pred);
                    query = new Query().where(pred);
                    result = query.executeLocal(dataManager);
                    expect(result.length).toBe(1);
                });
            });
        });
    });
    describe('Query operation in remote data', () => {
        let dataManager: DataManager;
        let query: Query;
        let result: Object[];
        describe('Remote data is generated properly', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/'
                });
                query = new Query().take(10);
                query.execute(dataManager).then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check length of generated data.', () => {
                expect(result.length).toBe(10);
            });
        });
        describe('from method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/'
                });
                query = new Query().from('Orders').take(10);
                query.execute(dataManager).then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });

            it('To check data in from query.', () => {
                expect(result.length).toBe(10);
            });
        });
        describe('multiple select method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/'
                });
                query = new Query().select(['OrderID', 'CustomerID', 'Freight']).select(['CustomerID', 'Freight']).take(10);
                query.execute(dataManager).then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check multiple selected method.', () => {
                expect(Object.keys(result[0])).toEqual(['OrderID', 'CustomerID', 'Freight']);
            });
            it('To check data in from query.', () => {
                expect(result.length).toBe(10);
            });
        });
    });
});