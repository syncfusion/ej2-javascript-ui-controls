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
    let sData: Object[] = [
        { OrderID: null, EmployeeID: null},
        { OrderID: null, EmployeeID: null},
        { OrderID: null, EmployeeID: null},
        { OrderID: null, EmployeeID: 23},
    ];
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
        it('To check null value column sorting - ascending', () => {
            dataManager = new DataManager(sData);
            query = new Query().sortBy('OrderID', 'ascending');
            result = query.executeLocal(dataManager);
            expect(result[sData.length - 1]['EmployeeID']).toBe(23);
        });
        it('To check null value column sorting - descending', () => {
            dataManager = new DataManager(sData);
            query = new Query().sortBy('OrderID', 'descending');
            result = query.executeLocal(dataManager);
            expect(result[sData.length - 1]['EmployeeID']).toBe(23);
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
    describe('isnotnull method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.isnotnull(null)).toBe(false);
            expect(DataUtil.fnOperators.isnotnull('Called')).toBe(true);
        });
    });
    describe('processSymbols method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.isnotnull(null)).toBe(false);
            expect(DataUtil.fnOperators.isnotnull('Called')).toBe(true);
        });
    });
    describe('isempty method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.isempty('')).toBe(true);
            expect(DataUtil.fnOperators.isempty(undefined)).toBe(true);
            expect(DataUtil.fnOperators.isempty('Called')).toBe(false);
        });
    });
    describe('isnotempty method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.isnotempty('Called')).toBe(true);
            expect(DataUtil.fnOperators.isnotempty('')).toBe(false);
            expect(DataUtil.fnOperators.isnotempty(undefined)).toBe(false);
        });
    });
    describe('doesnotstartwith method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.doesnotstartwith('hanar', 'ha')).toBe(false);
            expect(DataUtil.fnOperators.doesnotstartwith('hanar', 'an')).toBe(true);
            expect(DataUtil.fnOperators.doesnotstartwith('HaNar', 'an', true)).toBe(true);
            expect(DataUtil.fnOperators.doesnotstartwith('Áèèleè', 'le', true, true)).toBe(true);
        });
    });
    describe('doesnotendwith method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.doesnotendwith('hanar', 'ar')).toBe(false);
            expect(DataUtil.fnOperators.doesnotendwith('hanar', 'na')).toBe(true);
            expect(DataUtil.fnOperators.doesnotendwith('HaNar', 'na', true)).toBe(true);
            expect(DataUtil.fnOperators.doesnotendwith('Áèèleè', 'le', true, true)).toBe(true);
        });
    });
    describe('doesnotcontain method', () => {
        it('To check method is properly working.', () => {
            expect(DataUtil.fnOperators.doesnotcontain('hanar', 'ar')).toBe(false);
            expect(DataUtil.fnOperators.doesnotcontain('hanar', 'ra')).toBe(true);
            expect(DataUtil.fnOperators.doesnotcontain('HaNar', 'ra', true)).toBe(true);
            expect(DataUtil.fnOperators.doesnotcontain('Áèèleè', 'ea', true, true)).toBe(true);
        });

    });
    describe('like method', () => {
        it('To check like startswith is properly working.', () => {
            expect(DataUtil.fnOperators.like('hanar', '%an')).toBe(false);
            expect(DataUtil.fnOperators.like('hanar', '%ha')).toBe(true);
            expect(DataUtil.fnOperators.like('%hanar', '%%h')).toBe(true);
            expect(DataUtil.fnOperators.like('HaNar', '%ha', true)).toBe(true);
            expect(DataUtil.fnOperators.like('%HaNar', '%%h', true)).toBe(true);
            expect(DataUtil.fnOperators.like('Áèèleè', '%ae', true, true)).toBe(true);
        });
        it('To check like endswith is properly working.', () => {
            expect(DataUtil.fnOperators.like('hanar', 'na%')).toBe(false);
            expect(DataUtil.fnOperators.like('hanar', 'ar%')).toBe(true);
            expect(DataUtil.fnOperators.like('hanar%', 'r%%')).toBe(true);
            expect(DataUtil.fnOperators.like('HaNar', 'ar%', true)).toBe(true);
            expect(DataUtil.fnOperators.like('HaNar%', 'r%%', true)).toBe(true);
            expect(DataUtil.fnOperators.like('Áèèleè', 'ee%', true, true)).toBe(true);
        });
        it('To check like contains is properly working.', () => {
            expect(DataUtil.fnOperators.like('hanar', '%ra%')).toBe(false);
            expect(DataUtil.fnOperators.like('hanar', '%an%')).toBe(true);
            expect(DataUtil.fnOperators.like('han%ar', '%%%')).toBe(true);
            expect(DataUtil.fnOperators.like('HaNar', '%an%', true)).toBe(true);
            expect(DataUtil.fnOperators.like('HaN%ar', '%%%', true)).toBe(true);
            expect(DataUtil.fnOperators.like('Áèèleè', '%le%', true, true)).toBe(true);
        });
    });
    describe('wildcard method', () => {
        it('To check wildcard startswith is properly working.', () => {
            expect(DataUtil.fnOperators.wildcard('hanar', 'ah*')).toBe(false);
            expect(DataUtil.fnOperators.wildcard('hanar', 'ha*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaNar', 'ha*', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Áèèleè', 'ae*', true, true)).toBe(true);
        });
        it('To check wildcard endswith is properly working.', () => {
            expect(DataUtil.fnOperators.wildcard('hanar', '*ra')).toBe(false);
            expect(DataUtil.fnOperators.wildcard('hanar', '*ar')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaNar', '*ar', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Áèèleè', '*ee', true, true)).toBe(true);
        });
        it('To check wildcard contains is properly working.', () => {
            expect(DataUtil.fnOperators.wildcard('hanar', '*ra*')).toBe(false);
            expect(DataUtil.fnOperators.wildcard('hanar', '*an*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('han%ar', '*%*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaNar', '*an*', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaN%ar', '*%*', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Áèèleè', '*le*', true, true)).toBe(true);
        });
        it('To check wildcard single character ? and combination is properly working.', () => {
            expect(DataUtil.fnOperators.wildcard('hanar', 'h*nr')).toBe(false);
            expect(DataUtil.fnOperators.wildcard('hanar', 'h?n')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('ha%ar', 'h??a')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('hanar', 'h*n?r')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaNar', 'h?n', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Ha%Ar', 'h??a', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaNar', 'h*n?r', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('ha%ar', 'h*%?a*')).toBe(false);
            expect(DataUtil.fnOperators.wildcard('han%ar', 'h*?%a*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Han%Ar', 'h*?%a*', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('ha%ar', '*a?%*')).toBe(false);
            expect(DataUtil.fnOperators.wildcard('han%ar', '*a?%*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('HaN%ar', '*a?%*', true)).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Áèèleè', '*e?le*', true, true)).toBe(true);
        });
        it('Searching was not working with brackets.', () => {
            expect(DataUtil.fnOperators.wildcard('Chai (One)', '*)')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Chai (One)', '*(*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Chai (One)', 'Chai (')).toBe(true);
        });
        it('Searching bracket "[" in Grid throws script error.', () => {
            expect(DataUtil.fnOperators.wildcard('Chai (One)[', '*[')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Chai [(One)', '*[*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('[Chai (One)', '[*')).toBe(true);
        });
        it('Searching backslash character throws script error.', () => {
            expect(DataUtil.fnOperators.wildcard('Chai (One\\', '*\\')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Chai \\One)', '*\\*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('\\Chai One)', '\\*')).toBe(true);
            expect(DataUtil.fnOperators.wildcard('Chai \\One)', 'Chai \\')).toBe(true);
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
        it('EJ2-65554 - The Milliseconds value is not parsed properly with parseJSON method', () => {
            const parsedDate: any = DataUtil.parse.parseJson(['2021-02-03T00:00:03.556Z']);
            expect((parsedDate[0] as Date).getMilliseconds()).toBe(556);
        });
        it('EJ2-67751 - Milliseconds is displayed but time is incorrect', () => {
            const parsedDate: any = DataUtil.parse.parseJson(['2021-02-03T00:00:03.556123Z']);
            expect((parsedDate[0] as Date).getMilliseconds()).toBe(556);
        });
        it('EJ2-WI-835509 - parse the date without the seconds', () => {
            const parsedDate: any = DataUtil.parse.parseJson(['2023-06-24T15:41', '2023-06-24T15:41Z']);
            expect(!isNaN(parsedDate[0])).toBe(true);
            expect(!isNaN(parsedDate[1])).toBe(true);
        });
        it('EJ2-WI-852037 - parse the string value with double quotes', () => {
            const parsedData: any = DataUtil.parse.parseJson(['VINET\"s', "TOMSP"]);
            expect(parsedData[0]).toBe('VINET\"s');
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
    describe('jsonDateReplacer method', () => {
        it('replace date value without serverTimezoneOffset', () => {
            let result: string = JSON.stringify({ value: new Date()}, DataUtil.parse.jsonDateReplacer);
            expect(result).not.toBeNull;
            result = null;
        });
        it('replace date value with serverTimezoneOffset', () => {
            DataUtil.serverTimezoneOffset = 0;
            let result: string = JSON.stringify({ value: new Date()}, DataUtil.parse.jsonDateReplacer);
            DataUtil.serverTimezoneOffset = null;
            expect(result).not.toBeNull;
            result = null;
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
