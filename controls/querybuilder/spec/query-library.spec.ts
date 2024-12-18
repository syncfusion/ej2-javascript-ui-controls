/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, QueryLibrary,  RuleModel, ColumnsModel, ParameterizedSql, ParameterizedNamedSql } from '../src/query-builder/index';
import { createElement, remove, Browser } from '@syncfusion/ej2-base';

describe('Parameter SQL Query', () => {
    let queryBuilder: any;
    let employeeData: Object[] = [{
        'EmployeeID': 1,
        'LastName': 'Davolio',
        'FirstName': 'Nancy',
        'Title': 'Sales Representative',
        'TitleOfCourtesy': 'Ms.',
        'BirthDate': new Date(-664743600000),
        'HireDate': new Date(704692800000),
        'Address': '507 - 20th Ave. E.\r\nApt. 2A',
        'City': 'Seattle'
    },
    {
        'EmployeeID': 2,
        'LastName': 'Fuller',
        'FirstName': 'Andrew',
        'Title': 'Vice President, Sales',
        'TitleOfCourtesy': 'Dr.',
        'BirthDate': new Date(-563828400000),
        'HireDate': new Date(713764800000),
        'Address': '908 W. Capital Way',
        'City': 'Tacoma'
    },
    {
        'EmployeeID': 3,
        'LastName': 'Leverling',
        'FirstName': 'Janet',
        'Title': 'Sales Representative',
        'TitleOfCourtesy': 'Ms.',
        'BirthDate': new Date(-200088000000),
        'HireDate': new Date(702104400000),
        'Address': '722 Moss Bay Blvd.',
        'City': 'Kirkland'
    },
	{
		'EmployeeID': 5,
		'LastName': 'Buchanan',
		'FirstName': 'Steven',
		'Title': 'Sales Manager',
		'TitleOfCourtesy': 'Mr.',
		'Age': 34,
		'BirthDate': new Date(-468010800000),
		'HireDate': new Date(750830400000),
		'Address': '14 - Garrett Hill',
		'City': 'London'
	}];

    let importRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'Employee ID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'equal',
            'value': 1001
        },
        {
            'condition': 'or',
            'rules': [{
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'contains',
                'value':'Sales Manager'
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'contains',
                'value':'Sales'
            },
            {
            'condition': 'and',
                'rules': [{
                    'label': 'City',
                    'field': 'City',
                    'type': 'string',
                    'operator': 'equal',
                    'value': 'Kirkland'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'equal',
                    'value': '12/12/2019'
                }]
            }]
        }]
    };

    let mongoRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'Employee ID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'equal',
            'value': 1001
        },
        {
            'label': 'Employee ID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'notbetween',
            'value': 1001
        },
        {
            'label': 'Status',
            'field': 'Status',
            'type': 'boolean',
            'operator': 'equal',
            'value': true
        },
        {
            'condition': 'or',
            'rules': [{
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'notcontains',
                'value':'Sales Manager'
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'notbetween',
                'value':'Sales Manager'
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'notstartswith',
                'value':'Sales'
            },
            {
            'condition': 'and',
                'rules': [{
                    'label': 'City',
                    'field': 'City',
                    'type': 'string',
                    'operator': 'startswith',
                    'value': 'Kirkland'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'isempty',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'isnotempty',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'notequal',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'isnotnull',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'isnull',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'lessthanorequal',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'greaterthan',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'greaterthanorequal',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'between',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'lessthan',
                    'value': '12/12/2019'
                },
                {
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'notendswith',
                    'value': '12/12/2019'
                }]
            }]
        }]
    };

    let columnData2: ColumnsModel[] = [
        {
            field: 'TaskID', label: 'Task ID', type: 'number', operators: [{ key: 'equal', value: 'equal' },
            { key: 'greaterthan', value: 'greaterthan' }, { key: 'lessthan', value: 'lessthan' }]
        },
        { field: 'Name', label: 'Name', type: 'string' },
        { field: 'Category', label: 'Category', type: 'string' },
        { field: 'SerialNo', label: 'Serial No', type: 'string' },
        { field: 'InvoiceNo', label: 'Invoice No', type: 'string' },
        { field: 'Status', label: 'Status', type: 'string' },
        { field: 'Date', label: 'Date', type: 'date', operators: [{key: 'between', value: 'between'}] },
        { field: 'Order No', label: 'Order No', type: 'string'}
    ];
    let boolData: ColumnsModel[] = [
        { field: 'TaskID', label: 'Task ID', type: 'number' },
        { field: 'Name', label: 'Name', type: 'string' },
        { field: 'Category', label: 'Category', type: 'string' },
        { field: 'Status', label: 'Status', type: 'boolean' },
        { field: 'Date', label: 'Date', type: 'date', operators: [{key: 'equal', value: 'equal'}, {key: 'between', value: 'between'}] }
    ];

    let sqlRules: RuleModel = {
        'condition': 'or',
        'not': true,
        'rules': [{
            'label': 'Category',
            'field': 'Category',
            'type': 'string',
            'operator': 'endswith',
            'value': 'Laptop'
        },
        {
            'label': 'Category',
            'field': 'Category',
            'type': 'string',
            'operator': 'contains',
            'value': 'Lap'
        }]
    };

    beforeEach((): void => {
	let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
        document.body.appendChild(createElement('div', { id: 'querybuilder' }));
    });

    afterEach(() => {
        remove(queryBuilder.element.nextElementSibling);
        remove(queryBuilder.element);
        queryBuilder.destroy();
        (QueryBuilder as any).injectedModules = [];
    });

    it('mongo query - injection', () => {
        queryBuilder = null;
        queryBuilder = new QueryBuilder({
            dataSource: boolData
        }, '#querybuilder');
        const sqlString: string = '{"$or":[{"TaskID": null, "Status": true}]}';
        queryBuilder.setMongoQuery(sqlString);
        const mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
    });
    it('Parameter SQL - injection', () => {
        queryBuilder = new QueryBuilder({
            columns: columnData2,
            enableNotCondition: true
        }, '#querybuilder');
        let params: any = ['a', 'b', 1, 2];
        const sql: ParameterizedSql = { sql: '(Category IN (?,?) OR TaskID IN (?,?))', params: params };
        queryBuilder.setParameterizedSql(sql);
        const actSql: ParameterizedSql = queryBuilder.getParameterizedSql();
    });
    it('Named Parameter SQL - injection', () => {
        queryBuilder = new QueryBuilder({
            columns: columnData2,
            enableNotCondition: true
        }, '#querybuilder');
        const params: any = {"Category_1": "a", "Category_2": "b", "TaskID_1": 1, "TaskID_2": 2};
        const sql: ParameterizedNamedSql = { sql: '(Category IN (:Category_1,:Category_2) OR TaskID IN (:TaskID_1,:TaskID_2))', params: params };
        queryBuilder.setParameterizedNamedSql(sql);
        const actSql: ParameterizedNamedSql = queryBuilder.getParameterizedNamedSql();
    });

    it('Export Parameter SQL', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let params: any = [1001, '%Sales Manager%', '%Sales%', 'Kirkland', '12/12/2019'];
        let sqlString: ParameterizedSql = {sql: '(EmployeeID = ? AND (Title LIKE (?) OR Title LIKE (?) OR (City = ? AND HireDate = ?)))', params: params};
        let mongoQuery: ParameterizedSql = queryBuilder.getParameterizedSql(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        params = [1, 'Sales Manager', 'ewfew%', 'Mr.', 'ewfew%', '12/06/2024', 'reer%', 'erer%', 'ewfew%'];
        sqlString = {sql: '(EmployeeID = ? AND Title = ? AND (FirstName LIKE (?) OR TitleOfCourtesy = ? OR (FirstName LIKE (?) AND HireDate = ?) OR (FirstName LIKE (?) OR Title LIKE (?))) AND Title LIKE (?))', params: params};
        let actualSql: string = "EmployeeID = 1 AND Title = 'Sales Manager' AND (FirstName LIKE ('ewfew%') OR TitleOfCourtesy = 'Mr.' OR (FirstName LIKE ('ewfew%') AND HireDate = '12/06/2024') OR (FirstName LIKE ('reer%') OR Title LIKE ('erer%'))) AND Title LIKE ('ewfew%')";
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getParameterizedSql(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        params = [1001, '%Sales Manager%', 'Kirkland', 'fewfew%', 'efew%', 'erer%', 'ewfew%', 'efweew%'];
        sqlString = {sql: '(EmployeeID = ? AND (Title LIKE (?) OR (City = ? AND (FirstName LIKE (?) OR FirstName LIKE (?))) OR LastName LIKE (?)) AND (FirstName LIKE (?) AND Title LIKE (?)))', params: params};
        actualSql = "EmployeeID = 1001 AND (Title LIKE ('%Sales Manager%') OR (City = 'Kirkland' AND (FirstName LIKE ('fewfew%') OR FirstName LIKE ('efew%'))) OR LastName LIKE ('erer%')) AND (FirstName LIKE ('ewfew%') AND Title LIKE ('efweew%'))";
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getParameterizedSql(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        params = [1, 'rgerger%', 'erger%', 'asawd%', 'reger%', 'aefwaw%', 'ewrew%', 'ewfew%'];
        sqlString = {sql: '((EmployeeID = ? AND LastName LIKE (?) AND (FirstName LIKE (?) OR Title LIKE (?)) AND (Title LIKE (?) AND FirstName LIKE (?)) AND (Title LIKE (?) OR LastName LIKE (?))))', params: params};
        actualSql = "(EmployeeID = 1 AND LastName LIKE ('rgerger%') AND (FirstName LIKE ('erger%') OR Title LIKE ('asawd%')) AND (Title LIKE ('reger%') AND FirstName LIKE ('aefwaw%')) AND (Title LIKE ('ewrew%') OR LastName LIKE ('ewfew%')))";
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getParameterizedSql(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
    });

    it('get parameter sql from rules testing', () => {
        let sqlMultipleRules: RuleModel = {
            'condition': 'or', 'not': true, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' },
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'contains', 'value': 'Lap' },
                {'condition': 'or', 'not': true, 'rules': [
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' },
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'contains', 'value': 'Lap' }
                ]}
            ]
        };
        let simpleRule: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' }
            ]
        };
        let simpleRule1: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'isnull', 'value': null }
            ]
        };
        let simpleRule2: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'in', 'value': ['a', 'b'] },
                { 'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'in', 'value': [1, 2] }
            ]
        };
        let simpleRule3: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Order No', 'field': 'Order No', 'type': 'string', 'operator': 'equal', 'value': 'a' }
            ]
        };
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            columns: columnData2,
            rule: sqlRules,
            enableNotCondition: true
        }, '#querybuilder');
        let sql: ParameterizedSql = queryBuilder.getParameterizedSql(simpleRule);
        let params: any = ['%Laptop'];
        expect(sql).toEqual({ sql: '(Category LIKE (?))', params: params });
        sql = queryBuilder.getParameterizedSql(simpleRule1);
        expect(sql).toEqual({ sql: '(Category IS NULL)', params: [] });
        sql = queryBuilder.getParameterizedSql(simpleRule2);
        params = ['a', 'b', 1, 2];
        expect(sql).toEqual({ sql: '(Category IN (?,?) OR TaskID IN (?,?))', params: params });
        sql = queryBuilder.getParameterizedSql(simpleRule3);
        params = ['a'];
        expect(sql).toEqual({ sql: '(Order No = ?)', params: params });
        sql = queryBuilder.getParameterizedSql(sqlMultipleRules);
        params = ['%Laptop', '%Lap%', '%Laptop', '%Lap%'];
        expect(sql).toEqual({ sql: '(NOT (Category LIKE (?) OR Category LIKE (?) OR ( NOT (Category LIKE (?) OR Category LIKE (?)))))', params: params });
    });

    it('setRules from parameter sql rule testing', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            columns: columnData2,
            enableNotCondition: true
        }, '#querybuilder');
        let params: any = ['a', 'b', 1, 2];
        const sql: ParameterizedSql = { sql: '(Category IN (?,?) OR TaskID IN (?,?))', params: params };
        queryBuilder.setParameterizedSql(sql);
        const actSql: ParameterizedSql = queryBuilder.getParameterizedSql();
        expect(actSql).toEqual(sql);
    });

    it('get named parameter sql from rules testing', () => {
        let sqlMultipleRules: RuleModel = {
            'condition': 'or', 'not': true, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' },
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'contains', 'value': 'Lap' },
                {'condition': 'or', 'not': true, 'rules': [
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' },
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'contains', 'value': 'Lap' }
                ]}
            ]
        };
        let simpleRule: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' }
            ]
        };
        let simpleRule1: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'isnull', 'value': null }
            ]
        };
        let simpleRule2: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'in', 'value': ['a', 'b'] },
                { 'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'in', 'value': [1, 2] }
            ]
        };
        let simpleRule3: RuleModel = {
            'condition': 'or', 'not': false, 'rules': [
                { 'label': 'Order No', 'field': 'Order No', 'type': 'string', 'operator': 'equal', 'value': 'a' }
            ]
        };
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            columns: columnData2,
            rule: sqlRules,
            enableNotCondition: true
        }, '#querybuilder');
        let sql: ParameterizedNamedSql = queryBuilder.getParameterizedNamedSql(simpleRule);
        expect(JSON.stringify(sql)).toEqual('{"sql":"(Category LIKE (:Category_1))","params":{"Category_1":"%Laptop"}}');
        sql = queryBuilder.getParameterizedNamedSql(simpleRule1);
        expect(JSON.stringify(sql)).toEqual('{"sql":"(Category IS NULL)","params":{}}');
        sql = queryBuilder.getParameterizedNamedSql(simpleRule2);
        expect(JSON.stringify(sql)).toEqual('{"sql":"(Category IN (:Category_1,:Category_2) OR TaskID IN (:TaskID_1,:TaskID_2))","params":{"Category_1":"a","Category_2":"b","TaskID_1":1,"TaskID_2":2}}');
        sql = queryBuilder.getParameterizedNamedSql(simpleRule3);
        expect(JSON.stringify(sql)).toEqual('{"sql":"(Order No = :Order No_1)","params":{"Order No_1":"a"}}');
        sql = queryBuilder.getParameterizedNamedSql(sqlMultipleRules);
        expect(JSON.stringify(sql)).toEqual('{"sql":"(NOT (Category LIKE (:Category_1) OR Category LIKE (:Category_2) OR ( NOT (Category LIKE (:Category_3) OR Category LIKE (:Category_4)))))","params":{"Category_1":"%Laptop","Category_2":"%Lap%","Category_3":"%Laptop","Category_4":"%Lap%"}}');
    });

    it('setRules from named parameter sql rule testing', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            columns: columnData2,
            enableNotCondition: true
        }, '#querybuilder');
        const params: any = {"Category_1": "a", "Category_2": "b", "TaskID_1": 1, "TaskID_2": 2};
        const sql: ParameterizedNamedSql = { sql: '(Category IN (:Category_1,:Category_2) OR TaskID IN (:TaskID_1,:TaskID_2))', params: params };
        queryBuilder.setParameterizedNamedSql(sql);
        const actSql: ParameterizedNamedSql = queryBuilder.getParameterizedNamedSql();
        expect(actSql).toEqual(sql);
    });
    it('Export Mongo', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let sqlString: string = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City":"Kirkland"},{"HireDate":"12/12/2019"}]}]}]}';
        let mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        mongoQuery = queryBuilder.getMongoQuery();
        expect(mongoQuery).toEqual(sqlString);
        sqlString = '{"$and":[{"EmployeeID":1},{"Title":"Sales Manager"},{ "$or":[{"FirstName":{"$regex":"^ewfew"}},{"TitleOfCourtesy":"Mr."},{ "$and":[{"FirstName":{"$regex":"^ewfew"}},{"HireDate":"12/06/2024"}]},{ "$or":[{"FirstName":{"$regex":"^reer"}},{"Title":{"$regex":"^erer"}}]}]},{"Title":{"$regex":"^ewfew"}}]}';
        let actualSql: string = "EmployeeID = 1 AND Title = 'Sales Manager' AND (FirstName LIKE ('ewfew%') OR TitleOfCourtesy = 'Mr.' OR (FirstName LIKE ('ewfew%') AND HireDate = '12/06/2024') OR (FirstName LIKE ('reer%') OR Title LIKE ('erer%'))) AND Title LIKE ('ewfew%')";
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        sqlString = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{ "$and":[{"City":"Kirkland"},{ "$or":[{"FirstName":{"$regex":"^fewfew"}},{"FirstName":{"$regex":"^efew"}}]}]},{"LastName":{"$regex":"^erer"}}]},{ "$and":[{"FirstName":{"$regex":"^ewfew"}},{"Title":{"$regex":"^efweew"}}]}]}';
        actualSql = "EmployeeID = 1001 AND (Title LIKE ('%Sales Manager%') OR (City = 'Kirkland' AND (FirstName LIKE ('fewfew%') OR FirstName LIKE ('efew%'))) OR LastName LIKE ('erer%')) AND (FirstName LIKE ('ewfew%') AND Title LIKE ('efweew%'))";
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        sqlString = '{"$and":[{ "$and":[{"EmployeeID":1},{"LastName":{"$regex":"^rgerger"}},{ "$or":[{"FirstName":{"$regex":"^erger"}},{"Title":{"$regex":"^asawd"}}]},{ "$and":[{"Title":{"$regex":"^reger"}},{"FirstName":{"$regex":"^aefwaw"}}]},{ "$or":[{"Title":{"$regex":"^ewrew"}},{"LastName":{"$regex":"^ewfew"}}]}]}]}';
        actualSql = "(EmployeeID = 1 AND LastName LIKE ('rgerger%') AND (FirstName LIKE ('erger%') OR Title LIKE ('asawd%')) AND (Title LIKE ('reger%') AND FirstName LIKE ('aefwaw%')) AND (Title LIKE ('ewrew%') OR LastName LIKE ('ewfew%')))";
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        actualSql = 'EmployeeID = 1001 AND (Title LIKE (\'%Sales Manager%\') OR (City = \'Kirkland\' AND City IN (\'Kirkland\') AND "HireDate" IN ("12/12/2019") AND EmployeeID IN (1001) AND (FirstName LIKE (\'fewfew%\') OR FirstName LIKE (\'efew%\'))) OR LastName LIKE (\'erer%\')) AND (FirstName LIKE (\'ewfew%\') AND Title LIKE (\'efweew%\'))';
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        actualSql = '(EmployeeID = 1 AND LastName LIKE (\'rgerger%\') AND (FirstName LIKE (\'erger%\') OR Title LIKE (\'asawd%\')) AND (Title LIKE (\'reger%\') AND EmployeeID IN (1001, 1002) AND FirstName LIKE (\'aefwaw%\')) AND (Title LIKE (\'ewrew%\') OR LastName LIKE (\'ewfew%\')))';
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        actualSql = 'EmployeeID = 1001 AND (Title LIKE (\'%Sales Manager%\') OR (City = \'Kirkland\' AND City NOT IN (\'Kirkland\') AND "HireDate" NOT IN ("12/12/2019") AND EmployeeID NOT IN (1001) AND (FirstName LIKE (\'fewfew%\') OR FirstName LIKE (\'efew%\'))) OR LastName LIKE (\'erer%\')) AND (FirstName LIKE (\'ewfew%\') AND Title LIKE (\'efweew%\'))';
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        actualSql = '(EmployeeID = 1 AND LastName LIKE (\'rgerger%\') AND (FirstName LIKE (\'erger%\') OR Title LIKE (\'asawd%\')) AND (Title LIKE (\'reger%\') AND EmployeeID NOT IN (1001, 1002) AND FirstName LIKE (\'aefwaw%\')) AND (Title LIKE (\'ewrew%\') OR LastName LIKE (\'ewfew%\')))';
        queryBuilder.setRulesFromSql(actualSql);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
    });

    it('Export Mongo', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: mongoRules
        }, '#querybuilder');
        const mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
    });

    it('Import Mongo with basic', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let sqlString: string = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City":"Kirkland"},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        let mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        sqlString = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City": {"$nin": ["Kirkland"]}},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        sqlString = '{"$and":[{"EmployeeID":{"$lt": 1001, "$gt": 1010}},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City": {"$nin": ["Kirkland"]}},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"EmployeeID": 1001},{ "$or":[{"EmployeeID":{"$lt": 1001}},{"EmployeeID":{"$gt": 1010}}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"EmployeeID": {"$nin": [1001, 1002]}},{ "$or":[{"EmployeeID":{"$lt": 1001}},{"EmployeeID":{"$gt": 1010}}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
    });

    it('Import Mongo with between', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules,
            enableNotCondition: true
        }, '#querybuilder');
        let sqlString: string = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City":"Kirkland"},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        let mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
        sqlString = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City": {"$nin": ["Kirkland"]}},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        sqlString = '{"$and":[{"EmployeeID":{"$lt": 1001, "$gt": 1010}},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City": {"$nin": ["Kirkland"]}},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"EmployeeID": 1001},{ "$or":[{"EmployeeID":{"$lt": 1001}},{"EmployeeID":{"$gt": 1010}}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"EmployeeID": {"$nin": [1001, 1002]}},{ "$or":[{"EmployeeID":{"$lt": 1001}},{"EmployeeID":{"$gt": 1010}}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"EmployeeID": {"$nin": [1001, 1002]}},{ "$or":[{"EmployeeID":{"$gt": 1001}},{"EmployeeID":{"$lt": 1010}}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"EmployeeID": null},{ "$or":[{"EmployeeID":{"$gt": 1001}},{"EmployeeID":{"$lt": 1010}}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
    });

    it('Import Mongo Testing', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let sqlString: string = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{ "$and":[{"City":"Kirkland"},{"HireDate":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        const mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
    });

    it('import Mongo with number', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let sqlString: string = '{"$or":[{"EmployeeID":{"$ne":1001}},{"EmployeeID": { "$gte": 1}},{"EmployeeID": { "$gt": 1}},{"EmployeeID": {"$gte":1, "$lte":2}},{"EmployeeID": { "$lt": 8}},{"EmployeeID": { "$lte": 6}}]}';
        queryBuilder.setMongoQuery(sqlString);
        const mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
    });
    it('import Mongo with string', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let sqlString: string = '{"$or":[{"LastName":{"$ne":"d"}},{"LastName":{"$regex":"^d"}},{"FirstName":{"$regex":"a$"}},{"Title":{"$regex":"gh"}},{"FirstName": { "$in": ["Nancy","Andrew"]}},{"LastName": { "$nin": ["King","Callahan"]}}]}';
        queryBuilder.setMongoQuery(sqlString);
        const mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
    });
    it('import Mongo with boolean', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: boolData
        }, '#querybuilder');
        let sqlString: string = '{"$or":[{"TaskID": null, "Status": true}]}';
        queryBuilder.setMongoQuery(sqlString);
        let mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"Status":true},{ "$or":[{"Name":{"$regex":"Sales Manager"}},{"Name":{"$ne":""}},{ "$and":[{"Category":""},{"Date":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        sqlString = '{"$and":[{"Status":true},{ "$or":[{"Name":{"$ne":"Sales Manager"}},{"Name":{"$ne": null}},{ "$and":[{"Status": {"$ne": true}},{"Date":"12/12/2019"}]}]}]}';
        queryBuilder.setMongoQuery(sqlString);
        mongoQuery = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
    });
    it('EJ2 - 303046 - Date type value is not update properly while using the setMongoQuery method of query builder ', () => {
        let columns: ColumnsModel[] = [
            { field: "FirstName", label: "First Name", type: "string" },
            { field: "HireDate", label: "Hire Date", type: "date", format: "MM/dd/yyyy" }
        ]
        let importRules: RuleModel = {
            condition: "and",
            rules: [
                { label: "First Name", field: "FirstName", type: "string", operator: "startswith", value: "Andre" },
                { label: "Hire Date", field: "HireDate", type: "date", operator: "between", value: ["11/22/2023", "11/30/2023"] },
            ],
        };
        queryBuilder = new QueryBuilder({
            columns: columns,
            rule: importRules
        });
        queryBuilder.appendTo('#querybuilder');
        let validRule = queryBuilder.getValidRules();
        let mongoQuery = queryBuilder.getMongoQuery(validRule);
        mongoQuery = JSON.stringify(mongoQuery);
        queryBuilder.setMongoQuery(JSON.parse(mongoQuery));
        expect(queryBuilder.rule.rules[1].type).toEqual('date')
    });
});
