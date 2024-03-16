/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, QueryLibrary,  RuleModel, ColumnsModel, ParameterizedSql, ParameterizedNamedSql } from '../src/query-builder/index';
import { createElement, remove } from '@syncfusion/ej2-base';

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
        document.body.appendChild(createElement('div', { id: 'querybuilder' }));
    });
    afterEach(() => {
        remove(queryBuilder.element.nextElementSibling);
        remove(queryBuilder.element);
        queryBuilder.destroy();
        (QueryBuilder as any).injectedModules = [];
    });
    it('Export Parameter SQL', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        const params: any = [1001, '%Sales Manager%', '%Sales%', 'Kirkland', '12/12/2019'];
        const sqlString: ParameterizedSql = {sql: '(EmployeeID = ? AND (Title LIKE (?) OR Title LIKE (?) OR (City = ? AND HireDate = ?)))', params: params};
        const mongoQuery: ParameterizedSql = queryBuilder.getParameterizedSql(queryBuilder.getValidRules());
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
        const mongoQuery: string = queryBuilder.getMongoQuery(queryBuilder.getValidRules());
        expect(mongoQuery).toEqual(sqlString);
    });

    it('Import Mongo with basic', () => {
        QueryBuilder.Inject(QueryLibrary);
        queryBuilder = new QueryBuilder({
            dataSource: employeeData,
            rule: importRules
        }, '#querybuilder');
        let sqlString: string = '{"$and":[{"EmployeeID":1001},{ "$or":[{"Title":{"$regex":"Sales Manager"}},{"Title":{"$regex":"Sales"}},{ "$and":[{"City":"Kirkland"},{"HireDate":"12/12/2019"}]}]}]}';
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
});
