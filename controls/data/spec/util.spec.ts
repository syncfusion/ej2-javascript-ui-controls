/**
 * Test case for dataManager
 */

import { DataManager } from '../src/manager';
import { DataUtil, Group } from '../src/util';
import { Query, Predicate } from '../src/query';

describe('DataUtil', () => {
    let dataManager: DataManager;
    let query: Query;
    let result: Object[];
    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: null, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c8' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: null, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ] as Object) as JSON[];
    describe('sorting for null data method', () => {
        it('To check null value sorting in ascending.', () => {
            dataManager = new DataManager(data);
            query = new Query().sortBy('EmployeeID', 'ascending');
            result = query.executeLocal(dataManager);
            expect(result[0] <= result[1]).toBe(true);
        });
        it('To check null value sorting in descending.', () => {
            dataManager = new DataManager(data);
            query = new Query().sortBy('EmployeeID', 'descending');
            result = query.executeLocal(dataManager);
            expect(result[0] >= result[1]).toBe(true);
        });
    });
    describe('getValue method', () => {
        it('To check function in getValue method.', () => {
            new DataUtil();
            expect(DataUtil.getValue(() => { return <any>'called'; })).toBe('called');
        });
    });
    describe('getObject method', () => {
        it('To check data returned properly.', () => {
            let result: Object = DataUtil.getObject('Employee.FirstName', { Employee: null, FirstName: 'Smith' });
            expect(result).toBeNull;
        });
    });
    describe('min method', () => {
        it('To check function instead of field name.', () => {
            let result: Object = DataUtil.aggregates.min(data, DataUtil.fnAscending);
            expect(result).toBeNull;
        });
    });
    describe('max method', () => {
        it('To check function instead of field name.', () => {
            let result: Object = DataUtil.aggregates.max(data, DataUtil.fnAscending);
            expect(result).toBeNull;
        });
    });
    describe('notnull method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.notnull(null)).toBeTruthy;
            expect(DataUtil.fnOperators.notnull('Called')).toBeFalsy;
        });
    });
    describe('processSymbols method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.notnull(null)).toBeTruthy;
            expect(DataUtil.fnOperators.notnull('Called')).toBeFalsy;
        });
    });
    describe('parse method', () => {
        it('To check method is properly working when given text as boolean.', () => {
            expect(DataUtil.parse.parseJson(true)).toBe(true);
        });
        it('To check method is properly working when array of data.', () => {
            expect(DataUtil.parse.parseJson(['John'])).toEqual(['John']);
        });
        it('To check method is properly working when array of data.', () => {
            expect(DataUtil.parse.parseJson([1, 2])).toEqual([1, 2]);
        });
    });
    describe('isJson method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.parse.isJson([{ Name: 'John' }])).not.toBe(null);
        });
    });
    describe('isJson method using array', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.parse.isJson(['John'])).toEqual(['John']);
        });
    });
    describe('replacer method', () => {
        it('To check method is properly working.', () => {
            result = DataUtil.parse.replacer([{ name: 'John' }]);
            expect(result).not.toBeNull;
        });
        it('To check method using date value.', () => {
            result = DataUtil.parse.replacer([new Date()]);
            expect(result).not.toBeNull;
        });
        it('To check method using string value.', () => {
            result = DataUtil.parse.replacer(['John']);
            expect(result).not.toBeNull;
        });
    });
    describe('group method with aggregates', () => {
        let gpds = DataUtil.group(data, "OrderID");
        let gp = DataUtil.group(data.slice(2), "OrderID", [{ type: "sum", field: "OrderID" }], 0, gpds);
        it('check aggregate data', () => {
            expect((gp[0] as Group).aggregates["OrderID - sum"]).toBe(10250);
        })
    });
    describe('distinct value', () => {
        let distinctObject: Object[] = DataUtil.distinct(data, 'CustomerID', true);
        let distinctString: Object[] = DataUtil.distinct(data, 'CustomerID');
        it('distinct value check', () => {
            expect(distinctObject.length).toBe(4);
            expect(distinctString.length).toBe(4);
        });
    });
    describe('ignore diacritics values', () => {
        it('To ignore diacritics values', () => {
            let result: Object = DataUtil.ignoreDiacritics('Áèèleè');
            expect(result).toBe('Aeelee');
            result = DataUtil.ignoreDiacritics(10254);
            expect(result).toBe(10254);
            result = DataUtil.ignoreDiacritics(true);
            expect(result).toBe(true);
        });
    });
    describe('7222 Select method', () => {
        it('To check result structure for complex property from select method',() => {
            let result: Object = new DataManager([{ a: { b:25, c: 4 }, d: 10} ] ).executeLocal(new Query().select(['a.b', 'd']));
            expect(result.toString()).toBe([{a: { b: 25}, d: 10}].toString());
        });
    });

    describe('EJ2-7054-startwith lowercase conversion issue', () => {
        it('check endswith function', () => {
            expect(DataUtil.fnOperators.startswith(10332, 'abc', true, false)).toBeFalsy();
        });
    });

    describe('Timezone handling check', () => {
        it('toTimeZone method', () => {
            let dateVal: Date = new Date(2017, 1, 1);
            expect(DataUtil.dateParse.toTimeZone(dateVal, 1, true).getDay).not.toBeUndefined();
            expect(DataUtil.dateParse.toTimeZone(dateVal, 0, true).getDay).not.toBeUndefined();
            expect(DataUtil.dateParse.toTimeZone(dateVal, 0).getDay).not.toBeUndefined();
            expect(typeof DataUtil.parse.replacer({ val: dateVal }).val).toEqual('string');
        });
    });

});