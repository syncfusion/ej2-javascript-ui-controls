/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/tslint/config */
/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, ColumnsModel,  RuleModel, QueryBuilderModel, FormatObject, TemplateColumn, QueryLibrary } from '../src/query-builder/index';
import { createElement, remove, closest, select, selectAll, detach, getComponent, Internationalization, EmitType, EventHandler, Browser } from '@syncfusion/ej2-base';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { DropDownList, MultiSelect, CheckBoxSelection, DropDownTree } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
import { DatePicker, DateRangePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { profile , inMB, getMemoryProfile } from './common.spec';
import { DataManager, WebApiAdaptor, UrlAdaptor, Query, Deferred, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
MultiSelect.Inject(CheckBoxSelection);

/**
 * @param  {} 'Button'
 * @param  {} function(
 */

const intl = new Internationalization();
const clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);

describe('QueryBuilder', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    let queryBuilder: any;
    const complexBindingData: Object[] = [{
        'Employee': {
            'ID': 1001,
            'DOB': new Date(1996, 4, 23),
            'HireDate': new Date(2015, 3, 21),
            'Salary': 1000,
            'Age': 23,
            'Title': 'Mr'
        },
        'Name': {
            'FirstName': 'Joe',
            'LastName': 'peter'
        },
        'Country': {
            'State': {
                'City': 'San diego',
                'Zipcode': 22434
            },
            'Region': 'Pacific',
            'Name': 'USA'
        }
    },
    {
        'Employee': {
            'ID': 1002,
            'DOB': new Date(1995, 2, 28),
            'HireDate': new Date(2015, 5, 25),
            'Salary': 1300,
            'Age': 25,
            'Title': 'Mr'
        },
        'Name': {
            'FirstName': 'Mark',
            'LastName': 'lawrence'
        },
        'Country': {
            'State': {
                'City': 'Houston',
                'Zipcode': 77001
            },
            'Region': 'South central',
            'Name': 'USA'
        }
    },
    {
        'Employee': {
            'ID': 1003,
            'DOB': new Date(1996, 7, 7),
            'HireDate': new Date(2018, 9, 11),
            'Salary': 1400,
            'Age': 20,
            'Title': 'Mr'
        },
        'Name': {
            'FirstName': 'David',
            'LastName': 'malan'
        },
        'Country': {
            'State': {
                'City': 'Jersey City',
                'Zipcode': 27097
            },
            'Region': 'Mid-Atlantic',
            'Name': 'USA'
        }
    }];

    const complexData: object[] = [{
        'EmployeeID': 1,
        'FirstName': 'Nancy',
        'Height': 5.5,
        'Address': {
            'Street': '507 - 20th Ave. E.\r\nApt. 2A',
            'City': 'Seattle',
            'Region': 'WA',
            'PostalCode': 98.122,
            'Country': 'USA'
        }
    },
    {
        'EmployeeID': 2,
        'FirstName': 'Andrew',
        'Height': 5.6,
        'Address': {
            'Street': '908 W. Capital Way',
            'City': 'Tacoma',
            'Region': 'WA',
            'PostalCode': 98.401,
            'Country': 'USA'
        }
    },
    {
        'EmployeeID': 3,
        'FirstName': 'Janet',
        'Height': 5.7,
        'Address': {
            'Street': '722 Moss Bay Blvd.',
            'City': 'Kirkland',
            'Region': 'WA',
            'PostalCode': 98.033,
            'Country': 'USA'
        }
    }
    ];

    const employeeData: Object[] = [{
        'EmployeeID': 1,
        'LastName': 'Davolio',
        'FirstName': 'Nancy',
        'Title': 'Sales Representative',
        'TitleOfCourtesy': 'Ms.',
        'BirthDate': new Date(-664743600000),
        'HireDate': new Date(704692800000),
        'Address': '507 - 20th Ave. E.\r\nApt. 2A',
        'City': 'Seattle',
        'Region': 'WA',
        'PostalCode': '98122',
        'Country': 'USA',
        'HomePhone': '(206) 555-9857',
        'Extension': '5467',
        'Photo': { 'Length': 21626 }
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
        'City': 'Tacoma',
        'Region': 'WA',
        'PostalCode': '98401',
        'Country': 'USA',
        'HomePhone': '(206) 555-9482',
        'Extension': '3457',
        'Photo': { 'Length': 21626 }
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
        'City': 'Kirkland',
        'Region': 'WA',
        'PostalCode': '98033',
        'Country': 'USA',
        'HomePhone': '(206) 555-3412',
        'Extension': '3355',
        'Photo': { 'Length': 21722 }
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
        'City': 'London',
        'Region': null,
        'PostalCode': 'SW1 8JR',
        'Country': 'UK',
        'HomePhone': '(71) 555-4848',
        'Extension': '3453',
        'Photo': { 'Length': 21626 },
        'Notes': 'Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree in 1976.',
        'ReportsTo': 2,
        'PhotoPath': 'http://accweb/emmployees/buchanan.bmp'
    }];
    const mouseEvent: MouseEvent = document.createEvent('MouseEvents');
    const mouseEvent2: MouseEvent = document.createEvent('MouseEvents');

    const columnData: ColumnsModel[] = [
        {
            field: 'EmployeeName', label: 'Employee Name', type: 'string', operators: [{ key: 'equal', value: 'equal' }],
            values: ['Vinet'], format: '', step: 1, validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Designation', label: 'Designation', type: 'string', values: ['Project Lead'], format: '', step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Mail', label: 'Mail', type: 'string', values: ['andrew10@arpy.com'], format: '', step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Location', label: 'Location', type: 'string', values: ['Argentina'], format: '', step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Status', label: 'Status', type: 'boolean', values: ['Active', 'InActive'], format: '', step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Rating', label: 'Rating', type: 'number', values: ['Vinet'], format: '', step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'JoiningDate', label: 'Joining Date', type: 'date', format: 'dd/MM/yyyy', step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        } ,
        {
            field: 'DOB', label: 'DOB', type: 'date'
        }
    ];

    const columnsData: ColumnsModel[] = [
        {
            field: 'EmployeeName',
            label: 'Employee Name',
            type: 'string',
            operators: [{ key: 'equal', value: 'equal' }],
            values: ['Vinet'],
            format: '',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Designation',
            label: 'Designation',
            type: 'string',
            values: ['Project Lead'],
            format: '',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Mail',
            label: 'Mail',
            type: 'string',
            values: ['andrew10@arpy.com'],
            format: '',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Location',
            label: 'Location',
            type: 'string',
            values: ['Argentina'],
            format: '',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Status',
            label: 'Status',
            type: 'boolean',
            values: ['Active', 'InActive'],
            format: '',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'Rating',
            label: 'Rating',
            type: 'number',
            values: ['Vinet'],
            format: '',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'JoiningDate',
            label: 'Joining Date',
            type: 'date',
            format: 'dd/MM/yyyy',
            step: 1,
            validation: { isRequired: true, min: 5, max: 10 }
        },
        {
            field: 'DOB',
            label: 'DOB',
            type: 'date'
        }
    ];

    // Add 50 more columns with a for loop
    for (let i = 1; i <= 55; i++) {
        // Determine column type based on i (for variety)
        let columnType = 'string';
        if (i % 5 === 0) {columnType = 'number';}
        if (i % 7 === 0) {columnType = 'boolean';}
        if (i % 10 === 0) {columnType = 'date';}

        // Create default values based on type
        let values = [`Value${i}`];
        if (columnType === 'boolean') {values = ['True', 'False'];}
        if (columnType === 'number') {values = [String(i * 10)];}

        // Create and push the new column
        columnsData.push({
            field: `Field${i}`,
            label: `Field Label ${i}`,
            type: columnType,
            values: values,
            format: columnType === 'date' ? 'dd/MM/yyyy' : '',
            step: 1,
            validation: { isRequired: i % 3 === 0, min: 0, max: 100 }
        });
    }

    const importRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'In',
            'value': [4, 5]
        },
        {
            'condition': 'or',
            'rules': [{
                'label': 'price',
                'field': 'Price',
                'type': 'string',
                'operator': 'Equal',
                'value': [1]
            },
            {
                'label': 'CustomerID',
                'field': 'CustomerID',
                'type': 'number',
                'operator': 'In',
                'value': ['BERGS']
            },
            {
                'condition': 'and',
                'rules': [{
                    'label': 'in_stock',
                    'field': 'In stock',
                    'type': 'string',
                    'operator': 'Equal',
                    'value': ['Yes']
                },
                {
                    'label': 'OrderID',
                    'field': 'OrderID',
                    'type': 'number',
                    'operator': 'Equal',
                    'value': [10]
                }]
            }]
        },
        {
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'In',
            'value': [4, 5]
        }]
    };
    const columnData1: ColumnsModel[] = [
        {
            field: 'TaskID', label: 'Task ID', type: 'number', operators: [{ key: 'equal', value: 'equal' },
                { key: 'greaterthan', value: 'greaterthan' }, { key: 'lessthan', value: 'lessthan' }]
        },
        { field: 'Name', label: 'Name', type: 'string' },
        { field: 'Category', label: 'Category', type: 'string' },
        { field: 'SerialNo', label: 'Serial No', type: 'string' },
        { field: 'InvoiceNo', label: 'Invoice No', type: 'string' },
        { field: 'Status', label: 'Status', type: 'string' }
    ];
    const columnData2: ColumnsModel[] = [
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
    const boolData: ColumnsModel[] = [
        { field: 'TaskID', label: 'Task ID', type: 'number' },
        { field: 'Name', label: 'Name', type: 'string' },
        { field: 'Category', label: 'Category', type: 'string' },
        { field: 'Status', label: 'Status', type: 'boolean' },
        { field: 'Date', label: 'Date', type: 'date', operators: [{key: 'equal', value: 'equal'}, {key: 'between', value: 'between'}] }
    ];
    const dateFormatData: ColumnsModel[] = [
        { field: 'TaskID', label: 'Task ID', type: 'number' },
        { field: 'Name', label: 'Name', type: 'string' },
        { field: 'Date', label: 'Date', type: 'date', format: 'dd/MM/yyyy', operators: [{key: 'equal', value: 'equal'}, {key: 'notequal', value: 'notequal'}] }
    ];
    const eData: ColumnsModel[] = [
        {
            field: 'EmployeeID', label: 'Employee ID', type: 'number'
        },
        { field: 'FirstName', label: 'First Name', type: 'string' },
        { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
        { field: 'Title', label: 'Title', type: 'string' },
        { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
        { field: 'Country', label: 'Country', type: 'string' },
        { field: 'City', label: 'City', type: 'string' }
    ];
    const fieldData: ColumnsModel[] = [
        { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
        { field: 'FirstName', label: 'First Name', type: 'string' },
        { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
        { field: 'Title', label: 'Title', type: 'string' },
        { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
        { field: 'Country', label: 'Country', type: 'string' },
        { field: 'City', label: 'City', type: 'string' }
    ];
    const buttonData: ColumnsModel[] = [
        {
            field: 'EmployeeID', label: 'Employee ID'
        },
        { field: 'FirstName', label: 'First Name' },
        { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', values: ['Mr.', 'Mrs.'] },
        { field: 'Title', label: 'Title' },
        { field: 'HireDate', label: 'Hire Date', format: 'dd/MM/yyyy' },
        { field: 'Country', label: 'Country' },
        { field: 'City', label: 'City' }
    ];
    let elem: HTMLElement;
    let dropDownObj: DropDownList;
    let boxObj: CheckBox;
    let multiSelectObj: MultiSelect;
    const filter: ColumnsModel[] = [
        {
            field: 'Category', label: 'Category', type: 'string', template: {
                create: () => {
                    elem = document.createElement('input');
                    elem.setAttribute('type', 'text');
                    return elem;
                },
                destroy: (args: { elementId: string }) => {
                    (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect).destroy();
                },
                write: (args: { elements: Element, values: string[] }) => {
                    multiSelectObj = new MultiSelect({
                        dataSource: ['Food', 'Travel', 'Shopping', 'Mortgage', 'Salary', 'Clothing', 'Bills'],
                        value: args.values,
                        mode: 'CheckBox',
                        placeholder: 'Select category',
                        change: (e: any) => {
                            queryBuilder.notifyChange(e.value, e.element);
                        }
                    });
                    multiSelectObj.appendTo('#' + args.elements.id);
                }
            }
        },
        {
            field: 'PaymentMode', label: 'Payment Mode', type: 'string', template: {
                create: () => {
                    elem = document.createElement('input');
                    elem.setAttribute('type', 'text');
                    return elem;
                },
                destroy: (args: { elementId: string }) => {
                    (getComponent(document.getElementById(args.elementId), 'dropdownlist') as DropDownList).destroy();
                },
                write: (args: { elements: Element, values: string }) => {
                    const ds: string[] = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallet'];
                    dropDownObj = new DropDownList({
                        dataSource: ds,
                        value: args.values ? args.values : ds[0],
                        change: (e: any) => {
                            queryBuilder.notifyChange(e.itemData.value, e.element);
                        }
                    });
                    dropDownObj.appendTo('#' + args.elements.id);
                }
            },
            operators: [
                { key: 'Equal', value: 'equal' },
                { key: 'Not Equal', value: 'notequal' },
                { key: 'Starts With', value: 'startswith' },
                { key: 'Ends With', value: 'endswith' },
                { key: 'Contains', value: 'contains' }
            ]
        },
        {
            field: 'TransactionType', label: 'Transaction Type', type: 'boolean', template: {
                create: () => {
                    elem = document.createElement('input');
                    elem.setAttribute('type', 'checkbox');
                    return elem;
                },
                destroy: (args: { elementId: string }) => {
                    (getComponent(document.getElementById(args.elementId), 'checkbox') as CheckBox).destroy();
                },
                write: (args: { elements: Element, values: string }) => {
                    boxObj = new CheckBox({
                        label: 'Is Expensive',
                        checked: true,
                        change: (e: any) => {
                            queryBuilder.notifyChange(e.checked ? 'expensive' : 'income', e.event.target);
                        }
                    });
                    boxObj.appendTo('#' + args.elements.id);
                }
            },
            operators: [
                { key: 'Equal', value: 'equal' },
                { key: 'Not Equal', value: 'notequal' }]
        },
        { field: 'Description', label: 'Description', type: 'string' },
        { field: 'Date', label: 'Date', type: 'date', template: {
            create: () => {
                const parentElem = [];
                parentElem.push(document.createElement('input'));
                parentElem.push(document.createElement('input'));
                return parentElem;
            },
            destroy: (args: {elements: NodeListOf<Element>}) => {
                for (let i = 0, len = args.elements.length; i < len; i++) {
                    const date: TimePicker = getComponent(args.elements[i] as HTMLElement, 'timepicker') as TimePicker;
                    if (date) {
                        date.destroy();
                    }
                }
            },
            write: (args: {elements: Element, values: string, operator: string}) => {
                const format = { type: 'dateTime', skeleton: 'hm' };
                if (args.operator.indexOf('between') > -1) {
                    const dateArr: any = args.values ? args.values : [];
                    const dateRangeObj1 = new TimePicker({
                        placeholder: 'Select Time',
                        min: new Date('3/8/2017 0:00 AM'),
                        max: new Date('3/8/2017 2:00 AM'),
                        change: e => {
                            dateArr[0] = e.value ? intl.formatDate(e.value, format) : null;
                            queryBuilder.notifyChange(dateArr, e.element);
                        }
                    });
                    const dateRangeObj2 = new TimePicker({
                        placeholder: 'Select Time',
                        min: new Date('3/8/2017 0:00 AM'),
                        max: new Date('3/8/2017 2:00 AM'),
                        change: e => {
                            dateArr[1] = e.value ? intl.formatDate(e.value, format) : null;
                            queryBuilder.notifyChange(dateArr, e.element);
                        }
                    });
                    dateRangeObj1.appendTo('#' + args.elements[0].id);
                    dateRangeObj2.appendTo('#' + args.elements[1].id);
                }
            }
        },
        operators: [
            { key: 'Between', value: 'between' }
        ]
        },
        {
            field: 'Amount', label: 'Amount', type: 'number', template: {
                create: () => {
                    elem = document.createElement('div');
                    elem.setAttribute('class', 'ticks_slider');
                    return elem;
                },
                destroy: (args: { elementId: string }) => {
                    (getComponent(document.getElementById(args.elementId), 'slider') as Slider).destroy();
                },
                write: (args: { elements: Element, values: string }) => {
                    const slider: Slider = new Slider({
                        value: 30,
                        min: 0,
                        max: 100,
                        type: 'MinRange',
                        tooltip: { isVisible: true, placement: 'Before', showOn: 'Hover' },
                        change: (e: any) => {
                            queryBuilder.notifyChange(e.value, args.elements);
                        }
                    });
                    slider.appendTo('#' + args.elements.id);
                }
            },
            operators: [
                { key: 'Equal', value: 'equal' },
                { key: 'Not equal', value: 'notequal' },
                { key: 'Greater than', value: 'greaterthan' },
                { key: 'Less than', value: 'lessthan' },
                { key: 'Less than or equal', value: 'lessthanorequal' },
                { key: 'Greater than or equal', value: 'greaterthanorequal' }
            ]
        }
    ];
    const tempRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'Category',
            'field': 'Category',
            'type': 'string',
            'operator': 'equal',
            'value': ['Clothing']
        },
        {
            'condition': 'or',
            'rules': [{
                'label': 'TransactionType',
                'field': 'TransactionType',
                'type': 'boolean',
                'operator': 'equal',
                'value': 'Income'
            },
            {
                'label': 'PaymentMode',
                'field': 'PaymentMode',
                'type': 'string',
                'operator': 'equal',
                'value': 'Cash'
            }]
        },
        {
            'label': 'Amount',
            'field': 'Amount',
            'type': 'number',
            'operator': 'equal',
            'value': 10
        },
        {
            'label': 'Date',
            'field': 'Date',
            'type': 'date',
            'operator': 'between',
            'value': ['2/11/2021', '3/11/2021']
        }]
    };

    const importRules1: RuleModel = {
        'condition': 'or',
        'rules': [{
            'label': 'Category',
            'field': 'Category',
            'type': 'string',
            'operator': 'endswith',
            'value': 'Laptop'
        }]
    };
    const sqlRules: RuleModel = {
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
    const dateRules: RuleModel = {
        'condition': 'or',
        'rules': [{
            'label': 'DOB',
            'field': 'DOB',
            'type': 'date',
            'operator': 'equal',
            'value': '12/12/2001'
        }]
    };
    const eRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'equal',
            'value': 1
        },
        {
            'label': 'Title',
            'field': 'Title',
            'type': 'string',
            'operator': 'equal',
            'value': 'Sales Manager'
        }]
    };
    const noValue: RuleModel = {
        'condition': 'or',
        'rules': [{
            'label': 'DOB',
            'field': 'DOB',
            'type': 'date',
            'operator': 'equal'
        }]
    };

    const fieldRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'In',
            'value': [4, 5]
        },
        {
            'label': 'Title',
            'field': 'Title',
            'type': 'string',
            'operator': 'equal',
            'value': 'Sales Manager'
        }]
    };

    const operatorRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'between',
            'value': [4, 5]
        },
        {
            'label': 'Title',
            'field': 'Title',
            'type': 'string',
            'operator': 'in',
            'value': ['Sales Manager']
        },
        {
            'label': 'City',
            'field': 'City',
            'type': 'string',
            'operator': 'startswith',
            'value': 'u'
        }]
    };


    const dataRules: RuleModel = {
        'condition': 'and',
        'rules': [{
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'equal',
            'value': 1
        },
        {
            'condition': 'or',
            'rules': [{
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            }]
        }]
    };
    describe('DOM', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            queryBuilder.destroy();
            remove(queryBuilder.element);
        });
        it('Coverage improvement', () => {
            queryBuilder = new QueryBuilder({
                columns:columnsData
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-query-builder')).toBeTruthy();
        });
        it('Coverage improvement e', () => {
            const column2: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', template: null, columns: [
                    { field: 'ID', label: 'ID', type: 'number'}
                ]}
            ];
            queryBuilder = new QueryBuilder({
                columns:columnData
            }, '#querybuilder');
            const args: any = {value: 4};
            (<any>queryBuilder).isNumInput = true;
            (<any>queryBuilder).selectedColumn= {validation: {min: 2, max: 3}};
            (<any>queryBuilder).changeValue(4, args);
            (<any>queryBuilder).setColumnTemplate(column2[0]);
            (<any>queryBuilder).templateParser(null);
            expect(queryBuilder.element.classList.contains('e-query-builder')).toBeTruthy();
        });
        it('Coverage improvement rule', () => {
            const importRules: RuleModel = {
                condition: 'and',
                rules: [
                    { label: 'ID', field: 'Employee.ID.Name', type: 'string', operator: 'equal', value: 0 },
                    { label: 'Last Name', field: 'Name.LastName', type: 'string', operator: 'contains', value: 'malan' },
                    { condition: 'or', rules: [
                        { label: 'City', field: 'Country.State.City', operator: 'startswith', type: 'string', value: 'U' },
                        { label: 'Region', field: 'Country.Region', operator: 'endswith', type: 'string', value: 'c' },
                        { label: 'Name', field: 'Country.Name', operator: 'isnotempty' }
                    ]}
                ]
            };
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            const column: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]}
            ];
            const column1: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', type: 'string', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]}
            ];
            queryBuilder = new QueryBuilder({
                columns:columns,
                rule: importRules,
                separator: '.',
                dataSource: complexBindingData,
                showButtons: { cloneRule: true, groupInsert: true, ruleDelete: true, cloneGroup: true }
            }, '#querybuilder');
            (<any>queryBuilder).getValues(importRules.rules[0].field);
            (<any>queryBuilder).getDistinctValues(complexBindingData, importRules.rules[0].field);
            (<any>queryBuilder).updateSubFieldsLarge(column,column[0].field);
            (<any>queryBuilder).updateSubFieldsLarge(column1,column1[0].field);
            (<any>queryBuilder).cloneRuleBtnClick = true;
            (<any>queryBuilder).ruleIndex = -1;
            const target1 = createElement('div', { attrs: { id: 'e-container' } });
            target1.appendChild(createElement('div', { attrs: { class: 'e-rule-list' } }));
            const target = createElement('div', { attrs: { id: 'e-container' } });
            (<any>queryBuilder).appendRuleElem(target1);
            (<any>queryBuilder).allowValidation = true;
            (<any>queryBuilder).templateChange(target,null, 'field');
            expect(queryBuilder.element.classList.contains('e-query-builder')).toBeTruthy();
        });
        it('Coverage rule improvement', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1]},
                    {
                        'condition': 'and',
                        'rules': [
                            {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1]}
                        ]
                    }
                ]
            };

            // Generate 50 additional rules
            for (let i = 1; i <= 50; i++) {
                // Create different types of rules based on the index
                let rule: any;

                if (i % 5 === 0) {
                    // Create a date rule
                    rule = {
                        'label': `DateField${i}`,
                        'field': `DateField${i}`,
                        'type': 'date',
                        'operator': 'equal',
                        'value': new Date().toISOString()
                    };
                } else if (i % 3 === 0) {
                    // Create a boolean rule
                    rule = {
                        'label': `BoolField${i}`,
                        'field': `BoolField${i}`,
                        'type': 'boolean',
                        'operator': 'equal',
                        'value': i % 2 === 0
                    };
                } else if (i % 7 === 0) {
                    // Create a nested group
                    rule = {
                        'condition': i % 2 === 0 ? 'and' : 'or',
                        'rules': [
                            {
                                'label': `NestedField${i}`,
                                'field': `NestedField${i}`,
                                'type': 'string',
                                'operator': 'contains',
                                'value': `Value${i}`
                            },
                            {
                                'label': `NestedField${i+1}`,
                                'field': `NestedField${i+1}`,
                                'type': 'number',
                                'operator': 'greater',
                                'value': i * 10
                            }
                        ]
                    };
                } else {
                    // Create a standard string/number rule
                    const isNumber = i % 2 === 0;
                    rule = {
                        'label': `Field${i}`,
                        'field': `Field${i}`,
                        'type': isNumber ? 'number' : 'string',
                        'operator': isNumber ? 'greater' : 'contains',
                        'value': isNumber ? i * 5 : `Value${i}`
                    };
                }

                // Add the rule to the main rules array
                valRule.rules.push(rule);
            }
            const dataColl: object[] = [
                {'Name': 'A', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'},
                {'Name': 'B', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'},
                {'Name': 'C', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'}
            ];

            queryBuilder = new QueryBuilder({
                columns:columnsData,
                rule: valRule,
                separator: '|',
                dataSource: dataColl
            }, '#querybuilder');
            const changeargs: any = {cancel: true};
            (<any>queryBuilder).addRuleSuccessCallBack(changeargs);
            (<any>queryBuilder).beforeSuccessCallBack(changeargs);
            (<any>queryBuilder).changeValueSuccessCallBack(changeargs);
            (<any>queryBuilder).operatorChangeSuccess(changeargs);
            (<any>queryBuilder).deleteGroupSuccessCallBack(changeargs);
            (<any>queryBuilder).addRuleElement(null);
            (<any>queryBuilder).ddTree = null;
            (<any>queryBuilder).dropdownTreeClose();
            (<any>queryBuilder).refreshLevelColl();
            (<any>queryBuilder).updateSubFieldsLarge(columnsData,columnsData[0].field);
            (<any>queryBuilder).windowResizeHandler();
            (<any>queryBuilder).getValues(valRule.rules[0].field);
            (<any>queryBuilder).separator = '';
            (<any>queryBuilder).dataBind();
            (<any>queryBuilder).getValues(valRule.rules[0].field);
            expect(queryBuilder.element.classList.contains('e-query-builder')).toBeTruthy();
            (<any>queryBuilder).addGroupSuccess(changeargs);
        });
        it('Default testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-query-builder')).toBeTruthy();
            expect(queryBuilder.element.firstElementChild.classList.contains('e-group-container')).toBeTruthy();
            let childContent: Element = queryBuilder.element.firstElementChild.children[0];
            expect(childContent.classList.contains('e-group-header')).toBeTruthy();
            expect(childContent.children[0].classList.contains('e-drag-qb-rule')).toBeTruthy();
            expect(childContent.children[1].classList.contains('e-btn-group')).toBeTruthy();
            expect(childContent.children[2].classList.contains('e-group-action')).toBeTruthy();
            childContent = queryBuilder.element.firstElementChild.children[1];
            expect(childContent.classList.contains('e-group-body')).toBeTruthy();
            expect(childContent.firstElementChild.classList.contains('e-rule-list')).toBeTruthy();
            expect(childContent.firstElementChild.children[0].classList.contains('e-rule-container')).toBeTruthy();
        });

        it('Add Group / condition testing', () => {
            queryBuilder = new QueryBuilder({
                showButtons: { groupDelete: true, groupInsert: true, ruleDelete: true, cloneGroup: true },
                columns: columnData
            }, '#querybuilder');
            expect(queryBuilder.element.firstElementChild.classList.contains('e-group-container')).toBeTruthy();
            let childContent: Element = queryBuilder.element.firstElementChild.children[0];
            expect(childContent.classList.contains('e-group-header')).toBeTruthy();
            const addBtn: HTMLElement = select('.e-add-btn', childContent) as HTMLElement;
            addBtn.click();
            // Selecting add group
            (selectAll('.e-item', queryBuilder.element.nextElementSibling)[0] as HTMLElement).click();
            childContent = queryBuilder.element.firstElementChild.children[1].children[0];
            expect(childContent.classList.contains('e-rule-list')).toBeTruthy();
            expect(childContent.firstElementChild.classList.contains('e-rule-container')).toBeTruthy();
            expect(childContent.firstElementChild.nextElementSibling.children[0].classList.contains('e-group-header')).toBeTruthy();
            expect(childContent.firstElementChild.nextElementSibling.children[1].classList.contains('e-group-body')).toBeTruthy();
            addBtn.click();
            // Selecting add condition
            (selectAll('.e-item', queryBuilder.element.nextElementSibling)[1] as HTMLElement).click();
            expect(childContent.children[1].classList.contains('e-group-container')).toBeTruthy();
	        const cloneBtn: HTMLElement = document.getElementsByClassName('e-clone-grp-btn')[0] as HTMLElement;
            cloneBtn.click();
	        queryBuilder.enableSeparateConnector = true;
            cloneBtn.click();
        });

        it('QueryBuilder with cloneGroup', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [1, 2, 3, 4, 5]},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] },
                    {
                        'condition': 'and',
                        'rules': [
                            {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] }
                        ]
                    }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
                showButtons: { lockGroup: true, cloneGroup: true, lockRule: true, cloneRule: true }
            }, '#querybuilder');
            const cloneBtn: HTMLElement = document.getElementsByClassName('e-clone-rule-btn')[0] as HTMLElement;
            cloneBtn.click();
            const lockRule: HTMLElement = document.getElementsByClassName('e-lock-rule-btn')[0] as HTMLElement;
            lockRule.click();
            lockRule.click();
            lockRule.click();
            const lockGroup: HTMLElement = document.getElementsByClassName('e-lock-grp-btn')[0] as HTMLElement;
            const childLockGroup: HTMLElement = document.getElementsByClassName('e-lock-grp-btn')[1] as HTMLElement;
            childLockGroup.click();
            lockGroup.click();
            lockGroup.click();
        });

        it('QueryBuilder with cloneGroup - separate connector', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [1, 2, 3, 4, 5]},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] },
                    {
                        'condition': 'and',
                        'rules': [
                            {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] }
                        ]
                    }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                enableSeparateConnector: true,
                enableNotCondition: true,
                rule: valRule,
                showButtons: { lockGroup: true, cloneGroup: true, lockRule: true, cloneRule: true }
            }, '#querybuilder');
            const cloneBtn: HTMLElement = document.getElementsByClassName('e-clone-rule-btn')[0] as HTMLElement;
            cloneBtn.click();
            const lockRule: HTMLElement = document.getElementsByClassName('e-lock-rule-btn')[0] as HTMLElement;
            lockRule.click();
            lockRule.click();
            lockRule.click();
            const lockGroup: HTMLElement = document.getElementsByClassName('e-lock-grp-btn')[0] as HTMLElement;
            const childLockGroup: HTMLElement = document.getElementsByClassName('e-lock-grp-btn')[1] as HTMLElement;
            childLockGroup.click();
            lockGroup.click();
            lockGroup.click();
        });
    });

    describe('Property', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            queryBuilder.destroy();
            detach(queryBuilder.element);
        });
        it('QueryBuilder cloneGroup with Separate Connector', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [1, 2, 3, 4, 5]},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
                showButtons: { lockGroup: true, cloneGroup: true, lockRule: true, cloneRule: true },
                enableSeparateConnector: true
            }, '#querybuilder');
            const cloneBtn: HTMLElement = document.getElementsByClassName('e-clone-rule-btn')[0] as HTMLElement;
            cloneBtn.click();
        });
        it('displayMode testing Vertical', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                displayMode: 'Vertical'
            }, '#querybuilder');
            queryBuilder.addRules([{
                'label': 'CustomerID',
                'field': 'CustomerID',
                'type': 'number',
                'operator': 'In',
                'value': ['BERGS']
            }], 'group0');
            expect(queryBuilder.displayMode).toEqual('Vertical');
            let ruleElem: HTMLElement = queryBuilder.element.querySelector('.e-rule-container');
            expect(ruleElem.classList.contains('e-vertical-mode')).toBeTruthy();
            ruleElem = queryBuilder.element.querySelector('.e-rule-filter');
            expect(queryBuilder.element.querySelector('.e-rule-filter').style.display).toEqual('');
        });
        it('displayMode testing Horizontal', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                displayMode: 'Horizontal'
            }, '#querybuilder');
            queryBuilder.addRules([{
                'label': 'CustomerID',
                'field': 'CustomerID',
                'type': 'number',
                'operator': 'In',
                'value': ['BERGS']
            }], 'group0');
            let ruleElem: HTMLElement = queryBuilder.element.querySelector('.e-rule-container');
            if (window.innerWidth < 768) {
                expect(queryBuilder.displayMode).toEqual('Vertical');
                expect(ruleElem.classList.contains('e-vertical-mode')).toBeTruthy();
            } else {
                expect(queryBuilder.displayMode).toEqual('Horizontal');
                expect(ruleElem.classList.contains('e-horizontal-mode')).toBeTruthy();
            }
            ruleElem = queryBuilder.element.querySelector('.e-rule-filter');
            expect(queryBuilder.element.querySelector('.e-rule-filter').style.display).toEqual('');
        });
        it('height and width testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                height: '200px',
                width: '500px'
            }, '#querybuilder');
            expect(queryBuilder.element.style.height).toEqual('200px');
            expect(queryBuilder.height).toEqual('200px');
            expect(queryBuilder.width).toEqual('500px');
            expect(queryBuilder.element.style.width).toEqual('500px');
        });
        it('sortDirection - Descending -  testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                sortDirection: 'Descending'
            }, '#querybuilder');
            expect(queryBuilder.sortDirection).toEqual('Descending');
        });
        it('sortDirection - Ascending -  testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                sortDirection: 'Ascending'
            }, '#querybuilder');
            expect(queryBuilder.sortDirection).toEqual('Ascending');
        });
        it('sortDirection - Default -  testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                sortDirection: 'Default'
            }, '#querybuilder');
            expect(queryBuilder.sortDirection).toEqual('Default');
        });
        it('sortDirection - Descending -  testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                sortDirection: 'Descending'
            }, '#querybuilder');
            expect(queryBuilder.sortDirection).toEqual('Descending');
        });
        it('maxGroupCount testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                maxGroupCount: 3
            }, '#querybuilder');
            expect(queryBuilder.maxGroupCount).toBe(3);
        });
        it('cssClass testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                cssClass: 'e-custom-rule'
            }, '#querybuilder');
            expect(queryBuilder.cssClass).toEqual('e-custom-rule');
            expect(queryBuilder.element.classList.contains('e-custom-rule')).toBeTruthy();
            queryBuilder.cssClass = 'e-cust-rule';
            queryBuilder.dataBind();
            expect(queryBuilder.cssClass).toEqual('e-cust-rule');
            expect(queryBuilder.element.classList.contains('e-cust-rule')).toBeTruthy();
        });
        it('enable RTL testing', () => {
            queryBuilder = new QueryBuilder({
                enableRtl: true
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-rtl')).toBeTruthy();
        });

        it('disable RTL testing', () => {
            queryBuilder = new QueryBuilder({
                enableRtl: false
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-rtl')).toBeFalsy();
        });
        it('enable summaryView testing', () => {
            queryBuilder = new QueryBuilder({
                summaryView: false
            }, '#querybuilder');
            queryBuilder.summaryView = true;
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('block');
            queryBuilder.summaryView = false;
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('none');
            queryBuilder.summaryView = true;
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('block');
            queryBuilder = new QueryBuilder({
                rule: importRules,
                summaryView: true
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('block');
            queryBuilder = new QueryBuilder({
                summaryView: true
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('block');
        });
        it('enable/disable summaryView testing', () => {
            queryBuilder = new QueryBuilder({
                summaryView: true
            }, '#querybuilder');
            queryBuilder.element.querySelector('.e-collapse-rule').click();
        });
        it('disable summaryView testing', () => {
            const dataColl: object[] = [
                {'Name': 'A', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'},
                {'Name': 'B', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'},
                {'Name': 'C', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'}
            ];
            const columnDataColl: ColumnsModel[] = [
                { field: 'Name', label: 'Name', type: 'string' },
                { field: 'Designation', label: 'Designation', type: 'string' },
                { field: 'DOB', label: 'DOB', type: 'date', category: 'Date' },
                { field: 'DOJ', label: 'DOJ', type: 'date', category: 'Date' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: dataColl,
                summaryView: false,
                columns: columnDataColl
            }, '#querybuilder');
            expect(queryBuilder.element.querySelectorAll('.e-collapse-rule').length).toBe(0);
            queryBuilder.addRules([{ 'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['Nancy'] }], 'group0');
            const multiObj: MultiSelect = queryBuilder.element.querySelector('.e-control.e-multiselect').ej2_instances;
            multiObj[0].value = ['A', 'B'];
            multiObj[0].dataBind();
            (<HTMLElement>queryBuilder.element.querySelector('.e-control.e-multiselect')).click();
        });
        it('disable Button testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: importRules,
                showButtons: { groupDelete: false, groupInsert: false, ruleDelete: false }
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-rule-delete').classList.contains('e-button-hide')).toBeTruthy();
            expect(queryBuilder.element.querySelector('.e-deletegroup').classList.contains('e-button-hide')).toBeTruthy();
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            expect(document.getElementsByClassName('e-addgroup')[0].parentElement.classList.contains('e-button-hide')).toBeTruthy();
        });
        it('enable Button testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: importRules,
                showButtons: { groupDelete: true, groupInsert: true, ruleDelete: true }
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-rule-delete').classList.contains('e-button-hide')).toBeFalsy();
            expect(queryBuilder.element.querySelector('.e-deletegroup').classList.contains('e-button-hide')).toBeFalsy();
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            expect(document.getElementsByClassName('e-addgroup')[0].parentElement.classList.contains('e-button-hide')).toBeFalsy();
        });
        it('columns testing', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: eData,
                rule: eRules
            }, '#querybuilder');
            queryBuilder.element.querySelector('.e-rule-operator.e-operator span').click();
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            let selectedColumn: ColumnsModel = filterElem.dataSource[0];
            expect(filterElem.value).toEqual('EmployeeID');
            expect(selectedColumn.type).toEqual('number');
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            expect(operatorElem[0].value).toEqual('equal');
            let valueElem: NumericTextBox = queryBuilder.element.querySelector('.e-rule-value .e-control').ej2_instances;
            expect(valueElem[0].value).toEqual(1);
            expect(queryBuilder.rule.rules[0].value).toEqual(1);
            //increase the numerixtextbox value
            let ele: Element = valueElem[0].spinUp;
            mouseEvent.initEvent('mousedown', true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent('mouseup', true, true);
            ele.dispatchEvent(mouseEvent2);
            expect(valueElem[0].value).toEqual(2);
            expect(queryBuilder.rule.rules[0].value).toEqual(2);
            //Change the operator
            operatorElem[0].showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[3].click();
            expect(operatorElem[0].value).toEqual('between');
            expect(queryBuilder.rule.rules[0].operator).toEqual('between');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control').length).toBe(3);
            //Change the numeric textbox value
            valueElem = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].ej2_instances;
            ele = valueElem[0].spinUp;
            mouseEvent.initEvent('mousedown', true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent('mouseup', true, true);
            ele.dispatchEvent(mouseEvent2);
            expect(valueElem[0].value).toEqual(1);
            expect(queryBuilder.rule.rules[0].value[0]).toEqual(1);

            valueElem = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[1].ej2_instances;
            ele = valueElem[0].spinUp;
            mouseEvent.initEvent('mousedown', true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent('mouseup', true, true);
            ele.dispatchEvent(mouseEvent2);
            expect(valueElem[0].value).toEqual(1);
            expect(queryBuilder.rule.rules[0].value[1]).toEqual(1);

            //Change the operator
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            items = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[8].click();
            expect(operatorElem[0].value).toEqual('in');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control').length).toBe(2);
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control').classList.contains('e-multiselect')).toBeTruthy();

            //Change the field
            filterElem.showPopup();
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            items = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            items[1].click();
            selectedColumn = filterElem.dataSource[1];
            expect(filterElem.value).toEqual('FirstName');
            expect(selectedColumn.type).toEqual('string');

            expect(operatorElem[0].value).toEqual('in');
            expect(queryBuilder.rule.rules[0].operator).toEqual('in');
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control').classList.contains('e-multiselect')).toBeTruthy();

            //Change the field
            filterElem.showPopup();
            items = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            items[2].click();
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            selectedColumn = filterElem.dataSource[2];
            expect(selectedColumn.type).toEqual('boolean');
            operatorElem[0].showPopup();
            items = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[0].click();
            expect(operatorElem[0].value).toEqual('equal');
            expect(queryBuilder.rule.rules[0].operator).toEqual('equal');
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control').classList.contains('e-radio')).toBeTruthy();

        });
    });
    describe('set Models', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            queryBuilder.destroy();
            detach(queryBuilder.element);
        });
        it('Set Models', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: eData,
                rule: eRules
            }, '#querybuilder');

            //setmodel hight width
            queryBuilder.displayMode = 'Vertical';
            queryBuilder.dataBind();
            queryBuilder.displayMode = 'Horizontal';
            queryBuilder.dataBind();

            //setmodel hight width
            queryBuilder.width = '300px';
            queryBuilder.height = '700px';
            queryBuilder.dataBind();
            expect(queryBuilder.element.style.height).toEqual('700px');
            expect(queryBuilder.height).toEqual('700px');
            expect(queryBuilder.width).toEqual('300px');
            expect(queryBuilder.element.style.width).toEqual('300px');

            //setmodel sortDirection as Descending
            queryBuilder.sortDirection = 'Descending';
            queryBuilder.dataBind();
            expect(queryBuilder.columns[0].field).toEqual('TitleOfCourtesy');
            expect(queryBuilder.columns[1].field).toEqual('Title');
            expect(queryBuilder.columns[6].field).toEqual('City');
            expect(queryBuilder.sortDirection).toEqual('Descending');

            //setmodel sortDirection as Ascending
            queryBuilder.sortDirection = 'Ascending';
            queryBuilder.dataBind();
            expect(queryBuilder.columns[0].field).toEqual('City');
            expect(queryBuilder.columns[1].field).toEqual('Country');
            expect(queryBuilder.columns[6].field).toEqual('TitleOfCourtesy');
            expect(queryBuilder.sortDirection).toEqual('Ascending');

            //setmodel sortDirection as Default
            queryBuilder.sortDirection = 'Default';
            queryBuilder.dataBind();
            expect(queryBuilder.sortDirection).toEqual('Default');

            //setmodel maxGroupCount as Default
            queryBuilder.maxGroupCount = 2;
            queryBuilder.dataBind();
            expect(queryBuilder.maxGroupCount).toEqual(2);

            // setmodel cssclass
            queryBuilder.cssClass = 'e-queryrender';
            queryBuilder.dataBind();
            expect(queryBuilder.element.classList.contains('e-queryrender')).toBeTruthy();

            // setmodel enable rtl
            queryBuilder.enableRtl = true;
            queryBuilder.dataBind();
            expect(queryBuilder.element.classList.contains('e-rtl')).toBeTruthy();

            // setmodel disable rtl
            queryBuilder.enableRtl = false;
            queryBuilder.dataBind();
            expect(queryBuilder.element.classList.contains('e-rtl')).toBeFalsy();


            //  setmodel summaryView as true
            queryBuilder.summaryView = true;
            queryBuilder.dataBind();
            expect(selectAll('.e-summary-content', queryBuilder.element).length).toBe(1);

            // setmodel summaryView as false
            queryBuilder.summaryView = false;
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('none');

            //  setmodel disable Button testing
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            document.getElementsByClassName('e-addgroup')[0].parentElement.click();
            queryBuilder.showButtons = { groupDelete: false, groupInsert: false, ruleDelete: false };
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-rule-delete').classList.contains('e-button-hide')).toBeTruthy();
            expect(queryBuilder.element.querySelector('.e-deletegroup').classList.contains('e-button-hide')).toBeTruthy();
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            expect(document.getElementsByClassName('e-addgroup')[0].parentElement.classList.contains('e-button-hide')).toBeTruthy();

            // setmodel summaryView as false
            queryBuilder.showButtons = { groupDelete: true, groupInsert: true, ruleDelete: true };
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-rule-delete').classList.contains('e-button-hide')).toBeFalsy();
            expect(queryBuilder.element.querySelector('.e-deletegroup').classList.contains('e-button-hide')).toBeFalsy();
            (document.getElementsByClassName('e-dropdown-btn')[1] as HTMLElement).click();
            expect(document.getElementsByClassName('e-addgroup')[1].parentElement.classList.contains('e-button-hide')).toBeFalsy();
	    queryBuilder.showButtons = { lockGroup: true, cloneGroup: true, lockRule: true, cloneRule: true };
            queryBuilder.dataBind();
	    queryBuilder.showButtons = { lockGroup: false, cloneGroup: false, lockRule: false, cloneRule: false };
            queryBuilder.dataBind();
	    queryBuilder.allowDragAndDrop = true;
            queryBuilder.dataBind();
	    queryBuilder.enableSeparateConnector = true;
            queryBuilder.dataBind();
        });
        it('Set Models', () => {
            queryBuilder = new QueryBuilder({
                columns: eData,
                rule: eRules
            }, '#querybuilder');

            // setmodel change rules
            queryBuilder.rule = importRules1;
            queryBuilder.dataBind();

            // setmodel change column
            queryBuilder.columns = columnData1;
            queryBuilder.dataBind();

            // setmodel enablePersistence
            queryBuilder.enablePersistence = true;
            queryBuilder.dataBind();

            queryBuilder.locale = 'de-DE';
            queryBuilder.dataBind();

            expect(queryBuilder.dataSource.length).toBe(0);
            // setmodel datasource
            queryBuilder.dataSource = employeeData;
            queryBuilder.dataBind();
            expect(queryBuilder.dataSource.length).toBe(4);

        });
    });

    describe('Button Clicks', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder.element.nextElementSibling) {
                remove(queryBuilder.element.nextElementSibling);
            }
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });

        it('Button changes', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: buttonData,
                rule: eRules
            }, '#querybuilder');
            (document.getElementsByClassName('e-btngroup-or-lbl')[0] as HTMLElement).click();
            expect(queryBuilder.rule.condition).toEqual('or');
            queryBuilder.summaryView = true;
            queryBuilder.dataBind();
            expect(selectAll('.e-summary-content', queryBuilder.element).length).toBe(1);
            expect(document.getElementsByClassName('e-summary-content')[0].querySelector('textarea').value).toEqual('EmployeeID = 1 OR Title = \'Sales Manager\'');
            (document.getElementsByClassName('e-edit-rule')[0] as HTMLElement).click();
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('none');

            // Add group from dropdown button
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            document.getElementsByClassName('e-addgroup')[0].parentElement.click();
            // Add rule from dropdown button
            (document.getElementsByClassName('e-dropdown-btn')[1] as HTMLElement).click();
            document.getElementsByClassName('e-addrule')[0].parentElement.click();
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(4);
            // Delete Group button
            (document.getElementsByClassName('e-deletegroup')[0] as HTMLElement).click();
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(2);
            // Delete rule
            (document.getElementsByClassName('e-removerule')[0] as HTMLElement).click();
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);

            (document.getElementsByClassName('e-collapse-rule')[0] as HTMLElement).click();
            expect(selectAll('.e-summary-content', queryBuilder.element).length).toBe(1);
            document.getElementsByClassName('e-group-container')[0].remove();
            (document.getElementsByClassName('e-edit-rule')[0] as HTMLElement).click();
        });
        it('Button changes - Separate Connector', () => {
            queryBuilder = null;
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: buttonData,
                enableSeparateConnector: true,
                enableNotCondition: true,
                rule: eRules
            }, '#querybuilder');
            queryBuilder.rule.rules[0].custom = { type: 'question' };
            queryBuilder.rule.rules[1].custom = { type: 'answer' };
            const rule: any = queryBuilder.getValidRules();
            let args: any = { groupID: 'group0', cancel: false, type: 'field', value: 'EmployeeID', 'not': false };
            (queryBuilder as any).beforeSuccessCallBack(args, queryBuilder.element.querySelector('.e-rule-filter .e-input-group'));
            args = { groupID: 'group0', cancel: false, type: 'condition', value: 'and', 'not': false };
            (queryBuilder as any).beforeSuccessCallBack(args, queryBuilder.element.querySelector('.e-add-condition-btn'));
            args = { groupID: 'group0', cancel: false, type: 'condition', value: 'and', 'not': false };
            (queryBuilder as any).beforeSuccessCallBack(args, queryBuilder.element.querySelector('.e-qb-toggle-btn'));
        });

        it('Button changes with angular', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: buttonData,
                rule: eRules
            }, '#querybuilder');
            (document.getElementsByClassName('e-btngroup-or-lbl')[0] as HTMLElement).click();
            queryBuilder.summaryView = true;
            queryBuilder.dataBind();
            (document.getElementsByClassName('e-edit-rule')[0] as HTMLElement).click();
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            document.getElementsByClassName('e-addgroup')[0].parentElement.click();
            (document.getElementsByClassName('e-dropdown-btn')[1] as HTMLElement).click();
            document.getElementsByClassName('e-addrule')[0].parentElement.click();
            queryBuilder.isAngular = true;
            (document.getElementsByClassName('e-deletegroup')[0] as HTMLElement).click();
        });

	    it('Button changes with enableSeparateConnector', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: buttonData,
                enableSeparateConnector: true,
                rule: eRules
            }, '#querybuilder');
            (document.getElementsByClassName('e-btngroup-or-lbl')[1] as HTMLElement).click();
            expect(queryBuilder.rule.condition).toEqual('and');
            (document.getElementsByClassName('e-btngroup-and-lbl')[1] as HTMLElement).click();
        });
    });

    describe('Template support', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            queryBuilder.destroy();
        });

        it('Template sample', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: filter,
                rule: tempRules
            }, '#querybuilder');
            (document.getElementsByClassName('e-TransactionType')[0] as HTMLElement).click();
            expect(queryBuilder.rule.rules[1].rules[0].value).toEqual('income');

            // Field change
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[4].click();
            expect(filterElem[0].value).toEqual('Date');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('date');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-timepicker')).toBeTruthy();

            // Field change
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            expect(filterElem[0].value).toEqual('PaymentMode');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('string');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-dropdownlist')).toBeTruthy();

            // Field change
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
            expect(filterElem[0].value).toEqual('TransactionType');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('boolean');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-checkbox')).toBeTruthy();

            // Field change
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[5].click();
            expect(filterElem[0].value).toEqual('Amount');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('number');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-slider')).toBeTruthy();

            // Field change
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[3].click();
            expect(filterElem[0].value).toEqual('Description');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('string');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-textbox')).toBeTruthy();

            //Operator change
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[8].click();
            expect(operatorElem[0].value).toEqual('in');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-multiselect')).toBeTruthy();

            //Multiple select
            filterElem = queryBuilder.element.querySelector('.e-rule-operator input.e-control').ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[5].click();
            queryBuilder.allowValidation = true;
            queryBuilder.validateFields();
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(1);
            const msObj: MultiSelect = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            queryBuilder.updateRules(msObj[0].element, ['US'], 0);
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(0);
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[3].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule3_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[0].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-operator .e-control')[0].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[4].click();

        });

        it('EJ2-89633-The value template is not destroyed when two dropdown list popups are opened back to back in the query builder', () => {
            const rules: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'PaymentMode',
                    'field': 'PaymentMode',
                    'type': 'string',
                    'operator': 'equal'
                },
                {
                    'label': 'Description',
                    'field': 'Description',
                    'type': 'string',
                    'operator': 'equal'
                }
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: filter,
                rule: rules
            }, '#querybuilder');
            const dropDownElem: NodeListOf<HTMLElement> = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control');
            (getComponent(dropDownElem[1], 'dropdownlist') as DropDownList).showPopup();
            (getComponent(dropDownElem[0], 'dropdownlist') as DropDownList).showPopup();
            const itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[3].click();
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-textbox')).toBeTruthy();
            expect(queryBuilder.rule.rules[0].value).toEqual('');
        });
    });
    describe('Public Methods', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder.element.nextElementSibling) {
                remove(queryBuilder.element.nextElementSibling);
            }
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });

        it('setRules testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            queryBuilder.setRules(importRules);
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(3);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(6);
        });

        it('getsql from rules testing', () => {
            const sqlMultipleRules: RuleModel = {
                'condition': 'or', 'not': true, 'rules': [
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' },
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'contains', 'value': 'Lap' },
                    {'condition': 'or', 'not': true, 'rules': [
                        { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' },
                        { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'contains', 'value': 'Lap' }
                    ]}
                ]
            };
            const simpleRule: RuleModel = {
                'condition': 'or', 'not': false, 'rules': [
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'endswith', 'value': 'Laptop' }
                ]
            };
            const simpleRule1: RuleModel = {
                'condition': 'or', 'not': false, 'rules': [
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'isnull', 'value': null }
                ]
            };
            const simpleRule2: RuleModel = {
                'condition': 'or', 'not': false, 'rules': [
                    { 'label': 'Category', 'field': 'Category', 'type': 'string', 'operator': 'in', 'value': ['a', 'b'] },
                    { 'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'in', 'value': [1, 2] }
                ]
            };
            const simpleRule3: RuleModel = {
                'condition': 'or', 'not': false, 'rules': [
                    { 'label': 'Order No', 'field': 'Order No', 'type': 'string', 'operator': 'equal', 'value': 'a' }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData2,
                rule: sqlRules,
                enableNotCondition: true
            }, '#querybuilder');
            const fieldElem: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            const itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[6].click();
            expect(queryBuilder.getSqlFromRules()).toContain('Date');
            queryBuilder.setRules(sqlRules);
            expect(queryBuilder.getSqlFromRules()).toEqual('NOT (Category LIKE (\'%Laptop\') OR Category LIKE (\'%Lap%\'))');
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(2);
            queryBuilder.setRules(sqlMultipleRules);
            const sqlString: string = 'NOT (Category LIKE (\'%Laptop\') OR Category LIKE (\'%Lap%\') OR ( NOT (Category LIKE (\'%Laptop\') OR Category LIKE (\'%Lap%\'))))';
            expect(queryBuilder.getSqlFromRules()).toEqual(sqlString);
            queryBuilder.setRules(simpleRule);
            expect(queryBuilder.getSqlFromRules(simpleRule, true)).toEqual('`Category` LIKE (\'%Laptop\')');
            queryBuilder.setRules(simpleRule1);
            expect(queryBuilder.getSqlFromRules(simpleRule1, true)).toEqual('`Category` IS NULL');
            queryBuilder.setRules(simpleRule2);
            expect(queryBuilder.getSqlFromRules(simpleRule2)).toEqual('Category IN (\'a\',\'b\') OR TaskID IN (1,2)');
            queryBuilder.setRules(simpleRule3);
            const sql: string = queryBuilder.getSqlFromRules(queryBuilder.rule);
            queryBuilder.setRulesFromSql(sql);
        });

        it('setRules from sql rule testing', () => {
            queryBuilder = new QueryBuilder({
                columns: boolData,
                enableNotCondition: true
            }, '#querybuilder');
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category LIKE (\'%Laptop\')'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Status = true'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category = null'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('TaskID = -10'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category = "Nancy"'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category LIKE (\'%Nancy%\')'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category IS NULL'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('TaskID IN (1, 2)'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category IN (\'a\', \'b\')'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category LIKE (\'\')'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category NOT LIKE (\'\')'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category LIKE (\'%Laptop\') AND (NOT (Category LIKE (\'%L\')))'));
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Date BETWEEN \'1/6/2020\' AND \'1/8/2020\''));
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category LIKE (\'%Laptop\') AND (NOT (Category IS NULL))'));
        });

        it('getDataManagerQuery', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: buttonData
            }, '#querybuilder');
            (<HTMLElement>document.querySelector('.e-removerule')).click();
            expect(queryBuilder.getDataManagerQuery(queryBuilder.rule).queries.length).toBe(1);
            queryBuilder.setRules(dataRules);
            expect(queryBuilder.getDataManagerQuery(queryBuilder.rule).queries.length).toBe(2);
        });
        it('getFilteredRecords', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                rule: eRules
            }, '#querybuilder');
            (document.getElementsByClassName('e-removerule')[1] as HTMLElement).click();
            queryBuilder.getFilteredRecords();
        });
        it('addRules and deleteRules testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            queryBuilder.addRules([{
                'label': 'CustomerID',
                'field': 'CustomerID',
                'type': 'number',
                'operator': 'In',
                'value': ['BERGS']
            }], 'group0');
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(2);
            queryBuilder.deleteRules(['group0_rule0']);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
        });

        it('addGroups and deleteGroups testing', () => {
            const rule: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'In',
                    'value': [4, 5]
                }, {
                    'condition': 'and',
                    'rules': [{
                        'label': 'EmployeeID',
                        'field': 'EmployeeID',
                        'type': 'number',
                        'operator': 'In',
                        'value': [4, 5]
                    }]
                }, {
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'In',
                    'value': [4, 5]
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.addGroups([{
                'condition': 'and',
                'rules': [{
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'In',
                    'value': [4, 5]
                }]
            }], 'group0');
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            queryBuilder.addGroups([{
                'condition': 'and',
                'rules': [{
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'In',
                    'value': [6, 7]
                }]
            }], 'group0');
            queryBuilder.deleteGroups(['group1']);
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            queryBuilder.enableNotCondition = true;
            queryBuilder.dataBind();
            queryBuilder.addGroups([{
                'condition': 'and',
                'not': true,
                'rules': [{
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'In',
                    'value': [4, 5]
                }]
            }], 'group0');
            queryBuilder.setRules(rule);
            queryBuilder.deleteGroups(['group1']);
        });

        it('reset testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            queryBuilder.setRules(importRules);
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(3);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(6);
            queryBuilder.reset();
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(0);
        });

        it('reset testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            queryBuilder.addGroups([{
                'condition': 'and',
                'rules': [{
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'In',
                    'value': [4, 5]
                }]
            }], 'group0');
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            const rules: RuleModel = queryBuilder.getRules();
            expect(rules.rules.length).toBe(2);
            expect(rules.rules[1].rules.length).toBe(1);
        });
        it('Validation', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                allowValidation: true
            }, '#querybuilder');
            queryBuilder.validateFields();
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter input.e-control').ej2_instances;
            expect(filterElem[0].element.parentElement.classList.contains('e-tooltip')).toBeTruthy();
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(1);
            filterElem[0].showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            items[3].click();
            expect(filterElem[0].element.parentElement.classList.contains('e-tooltip')).toBeFalsy();
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(0);
            queryBuilder.validateFields();
            filterElem = queryBuilder.element.querySelector('.e-rule-operator input.e-control').ej2_instances;
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(1);
            filterElem[0].showPopup();
            items = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[3].click();
            expect(filterElem[0].element.parentElement.classList.contains('e-tooltip')).toBeFalsy();
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(1);
            filterElem = queryBuilder.element.querySelector('.e-rule-operator input.e-control').ej2_instances;
            filterElem[0].showPopup();
            items = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[9].click();
            queryBuilder.validateFields();
            const textBoxObj: TextBox = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            textBoxObj[0].element.dispatchEvent(new Event('focus'));
            textBoxObj[0].element.dispatchEvent(new KeyboardEvent('keypress', {'key': 'c'}));
            textBoxObj[0].dataBind();
            queryBuilder.updateRules(textBoxObj[0].element, 'US', 0);
            expect(textBoxObj[0].element.parentElement.classList.contains('e-tooltip')).toBeFalsy();
            expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(0);
        });
        it('Validation - Empty Operator', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                allowValidation: true
            }, '#querybuilder');
            queryBuilder.setRules({condition: 'and', rules: [{field: 'EmployeeName', operator: 'equal', value: 'a'}]});
            queryBuilder.rule.rules[0].operator = null;
            queryBuilder.validateFields();
            queryBuilder.setRules({condition: 'and', rules: [{field: 'JoiningDate', type: 'date', operator: 'equal', value: null}]});
            queryBuilder.validateFields();
            queryBuilder.setRules({condition: 'and', rules: [{field: 'JoiningDate', type: 'date', operator: 'isnull', value: '22/11/2024'}]});
            queryBuilder.validateFields();
            queryBuilder.setRules({condition: 'and', rules: [{field: 'JoiningDate', type: 'date', operator: 'between', value: ['19/11/2024', '22/11/2024']}]});
            queryBuilder.rule.rules[0].value = [null, '22/11/2024'];
            queryBuilder.validateFields();
        });
        it('Date Value changes', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRules
            }, '#querybuilder');
            const cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].value.toDateString()).toEqual('Wed Feb 10 2021');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'notequal', 'value': '2/10/2021'}], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].value.toDateString()).toEqual('Wed Feb 10 2021');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{ 'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'greaterthan', 'value': '2/10/2021' }], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Wed Feb 10 2021');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{ 'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'lessthanorequal', 'value': '2/10/2021' }], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Wed Feb 10 2021');
            const datePObj: DatePicker = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].ej2_instances;
            datePObj[0].show();
            (<HTMLElement>document.querySelectorAll('.e-datepicker.e-popup .e-cell')[5]).click();
        });

        it('Date Value changes notequal operator', () => {
            const dateRule: RuleModel = {
                'condition': 'or',
                'rules': [{
                    'label': 'DOB',
                    'field': 'DOB',
                    'type': 'date',
                    'operator': 'notequal',
                    'value': '12/12/2001'
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRule
            }, '#querybuilder');
            const cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].value.toDateString()).toEqual('Wed Feb 10 2021');
        });

        it('Date Value changes greaterthan operator', () => {
            const dateRule: RuleModel = {
                'condition': 'or',
                'rules': [{
                    'label': 'DOB',
                    'field': 'DOB',
                    'type': 'date',
                    'operator': 'greaterthan',
                    'value': '12/12/2001'
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRule
            }, '#querybuilder');
            const cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Wed Feb 10 2021');
        });

        it('Date Value changes greaterthanorequal operator', () => {
            const dateRule: RuleModel = {
                'condition': 'or',
                'rules': [{
                    'label': 'DOB',
                    'field': 'DOB',
                    'type': 'date',
                    'operator': 'greaterthanorequal',
                    'value': '12/12/2001'
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRule
            }, '#querybuilder');
            const cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Wed Feb 10 2021');
        });

        it('Date Value changes lessthan operator', () => {
            const dateRule: RuleModel = {
                'condition': 'or',
                'rules': [{
                    'label': 'DOB',
                    'field': 'DOB',
                    'type': 'date',
                    'operator': 'lessthan',
                    'value': '12/12/2001'
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRule
            }, '#querybuilder');
            const cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Wed Feb 10 2021');
        });

        it('Date Value changes lessthanorequal operator', () => {
            const dateRule: RuleModel = {
                'condition': 'or',
                'rules': [{
                    'label': 'DOB',
                    'field': 'DOB',
                    'type': 'date',
                    'operator': 'lessthanorequal',
                    'value': '12/12/2001'
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRule
            }, '#querybuilder');
            const cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Wed Feb 10 2021');
        });

        it(' Radio Button Checking', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: fieldRules
            }, '#querybuilder');

            // Field change
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
            expect(filterElem[0].value).toEqual('TitleOfCourtesy');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('boolean');

            //operator change
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[0].click();
            expect(operatorElem[0].value).toEqual('equal');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-radio')).toBeTruthy();

            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            expect(filterElem[0].value).toEqual('FirstName');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('string');
        });
        it(' in Operator Checking', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: operatorRules
            }, '#querybuilder');
            queryBuilder.getFilteredRecords(queryBuilder.rule);
            expect(queryBuilder.getSqlFromRules(queryBuilder.rule)).toEqual('EmployeeID BETWEEN 4 AND 5 AND Title IN (\'Sales Manager\') AND City LIKE (\'u%\')');
	    queryBuilder.getOperator(queryBuilder.getSqlFromRules(queryBuilder.rule), 'NOT LIKE', true);
            queryBuilder.getRulesFromSql('EmployeeID BETWEEN 4 AND 5 and Title IN (\'Sales Manager\') and City LIKE (\'u%\')');
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[5].click();
            expect(operatorElem[0].value).toEqual('notbetween');
            operatorElem  = queryBuilder.element.querySelectorAll('.e-rule-operator .e-control')[1].ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule1_operatorkey_options').querySelectorAll('li');
            itemsCln[9].click();
            expect(operatorElem[0].value).toEqual('notin');
            queryBuilder.getFilteredRecords(queryBuilder.rule);
            expect(queryBuilder.getSqlFromRules(queryBuilder.rule)).toEqual('EmployeeID NOT BETWEEN 0 AND 0 AND Title NOT IN (\'Sales Manager\') AND City LIKE (\'u%\')');
            queryBuilder.reset();
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(0);
            queryBuilder.setRulesFromSql('EmployeeID BETWEEN 0 AND 0 and Title IN (\'Sales Manager\') and City LIKE (\'u%\')');
            expect(JSON.stringify(queryBuilder.getRulesFromSql('EmployeeID BETWEEN 0 AND 0 and Title IN (\'Sales Manager\') and City LIKE (\'u%\')').rules)).toEqual('[{"label":"Employee ID","field":"EmployeeID","operator":"between","type":"number","value":[0,0]},{"label":"Title","field":"Title","operator":"in","type":"string","value":["Sales Manager"]},{"label":"City","field":"City","operator":"startswith","value":"u","type":"string"}]');
        });
        it(' Multiple value in textbox  Checking', () => {
            const valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'First Name',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'equal',
                    'value': ['Nancy', 'Andrew', 'Janet']
                }] };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: valRule
            }, '#querybuilder');
            queryBuilder.addRules([{
                'label': 'First Name',
                'field': 'FirstName',
                'type': 'string',
                'operator': 'equal',
                'value': 'US,45,45,4'
            }], 'group0');
            queryBuilder.updateRules(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0], 'US,45,45,4', 0);

        });
        it('Custom Operator Checking', () => {
            const operators: { [key: string]: Object }[] = [
                {value: 'equal', key: 'Equal', sqlOperator: '='},
                {value: 'notequal', key: 'Not Equal', sqlOperator: '<>'}
            ];
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string', operators: operators }
            ];
            const valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'First Name',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'notequal',
                    'value': 'Nancy'
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                rule: valRule
            }, '#querybuilder');
            expect(queryBuilder.getSqlFromRules(valRule)).toEqual('FirstName <> \'Nancy\'');
        });
        it('Not Condition Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'notequal', 'value': 'Nancy'},
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1 }
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: valRule,
                enableNotCondition: true
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-qb-toggle.e-control').classList.contains('e-active-toggle')).toBeTruthy();
            queryBuilder.element.querySelector('.e-qb-toggle.e-control').click();
            expect(queryBuilder.rule.not).toEqual(false);
            expect(queryBuilder.getRule('group0_rule1').value).toEqual(1);
            queryBuilder.enableNotCondition = false;
            queryBuilder.dataBind();
            queryBuilder.enableNotCondition = true;
            queryBuilder.dataBind();
            (<HTMLElement>queryBuilder.element.querySelector('.e-qb-toggle')).click();
            (<HTMLElement>queryBuilder.element.querySelector('.e-qb-toggle')).click();
            (<HTMLElement>queryBuilder.element.querySelector('.e-btngroup-and-lbl')).click();
        });
        it('Readonly Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'notequal', 'value': 'Nancy'},
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1 },
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1, 2] },
                    {'condition': 'or', 'not': false, rules: [
                        {'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr' },
                        {'label': 'Hire Date', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '02/10/2021' }
                    ]},
                    { 'condition': 'or', 'not': true, rules: [
                        { 'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr' },
                        { 'label': 'Hire Date', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '02/10/2021' }
                    ]},
                    { 'condition': 'and', 'not': false, rules: [
                        { 'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr' },
                        { 'label': 'Hire Date', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '02/10/2021' }
                    ]}
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: valRule,
                enableNotCondition: true,
                readonly: true
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-btngroup-or-lbl').classList.contains('e-readonly')).toBeTruthy();
            queryBuilder.readonly = false;
            queryBuilder.dataBind();
            queryBuilder.readonly = true;
            queryBuilder.dataBind();
            const inputObj: any = queryBuilder.element.querySelector('.e-filter-input');
            const keyEvent: any = document.createEvent('KeyboardEvents');
            keyEvent.initKeyboardEvent('keydown', true, true, null, false, false, false, false, 40, 40);
            Object.defineProperties(keyEvent, { keyCode: {value: 40} });
            inputObj.dispatchEvent(keyEvent);
        });
        it('Keyboard event Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'notequal', 'value': 'Nancy'},
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1 },
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1, 2] },
                    {'condition': 'or', 'not': false, rules: [
                        {'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr' },
                        {'label': 'Hire Date', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '02/10/2021' }
                    ]},
                    { 'condition': 'or', 'not': true, rules: [
                        { 'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr' },
                        { 'label': 'Hire Date', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '02/10/2021' }
                    ]},
                    { 'condition': 'and', 'not': false, rules: [
                        { 'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr' },
                        { 'label': 'Hire Date', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '02/10/2021' }
                    ]}
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: valRule,
                enableNotCondition: true,
                readonly: true,
                allowDragAndDrop: true
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-btngroup-or-lbl').classList.contains('e-readonly')).toBeTruthy();
            queryBuilder.readonly = false;
            queryBuilder.dataBind();
            queryBuilder.readonly = true;
            queryBuilder.dataBind();
            const inputObj: any = queryBuilder.element.querySelector('.e-filter-input');
            const keyEvent: any = document.createEvent('KeyboardEvents');
            keyEvent.initKeyboardEvent('keydown', true, true, null, false, false, false, false, 40, 40);
            Object.defineProperties(keyEvent, { code: {value: 'Escape'} });
            inputObj.dispatchEvent(keyEvent);
        });
        it('Value Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'in', 'value': [1] }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: boolData,
                rule: valRule
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control.e-input').classList.contains('e-textbox')).toBeTruthy();
            let inputObj: any = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances[0];
            inputObj.element.value = '10';
            let keyEvent = document.createEvent('KeyboardEvents');
            Object.defineProperty(keyEvent, 'target', {writable: false, value: inputObj.element});
            inputObj.inputHandler(keyEvent);
            queryBuilder.immediateModeDelay = true;
            queryBuilder.dataBind();
            queryBuilder.addRules([{ 'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['Nancy'] }], 'group0');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control.e-input')[1].classList.contains('e-textbox')).toBeTruthy();
            inputObj = queryBuilder.element.querySelectorAll('.e-rule-value input.e-control')[1].ej2_instances[0];
            inputObj.element.value = 'Software';
            keyEvent = document.createEvent('KeyboardEvents');
            Object.defineProperty(keyEvent, 'target', {writable: false, value: inputObj.element});
            inputObj.inputHandler(keyEvent);
            queryBuilder.addRules([{ 'label': 'Status', 'field': 'Status', 'type': 'boolean', 'operator': 'equal', 'value': true }], 'group0');
            (<HTMLElement>queryBuilder.element.querySelectorAll('.e-control.e-radio')[1]).click();
            let operatorElem: DropDownList = queryBuilder.element.querySelectorAll('.e-rule-operator .e-control')[2].ej2_instances;
            operatorElem[0].showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule2_operatorkey_options').querySelectorAll('li');
            items[1].click();
            queryBuilder.addRules([{ 'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': ['02/03/1989', '03/03/1989'] }], 'group0');
            operatorElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[3].ej2_instances;
            operatorElem[0].showPopup();
            items = document.getElementById('querybuilder_group0_rule3_filterkey_options').querySelectorAll('li');
            items[0].click();
            queryBuilder.addRules([{ 'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'equal', 'value': '02/03/1989' }], 'group0');
            operatorElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[4].ej2_instances;
            operatorElem[0].showPopup();
            items = document.getElementById('querybuilder_group0_rule4_filterkey_options').querySelectorAll('li');
            items[0].click();

        });
        it('Multiselect Checking', (done: Function) => {
            const empData: Object[] = [
                {'EmployeeID': '1', 'Name': 'A'},
                {'EmployeeID': '2', 'Name': 'B'},
                {'EmployeeID': '3', 'Name': 'C'},
                {'EmployeeID': '4', 'Name': 'D'},
                {'EmployeeID': '5', 'Name': 'E'}
            ];
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': ['1'] }
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: empData,
                columns: empField,
                rule: valRule
            }, '#querybuilder');
            const listObj: any = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances[0];
            (<any>listObj).inputElement.focus();
            listObj.showPopup();
            const listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_valuekey0_popup').querySelectorAll('li');
                items[1].click();
                document.getElementById('querybuilder').click();
                expect(queryBuilder.rule.rules[0].value[0]).toEqual(1);
            }
            listObj.hidePopup();
            done();
        });
        it('Operator Checking', () => {
            const empData: Object[] = [
                {'EmployeeID': '1', 'Name': 'A'},
                {'EmployeeID': '2', 'Name': 'B'},
                {'EmployeeID': '3', 'Name': 'C'},
                {'EmployeeID': '4', 'Name': 'D'},
                {'EmployeeID': '5', 'Name': 'E'}
            ];
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': ['1'] }
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: empData,
                columns: empField,
                rule: valRule
            }, '#querybuilder');
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[1].click();
        });
        it('Multiselect without datasource Checking', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [1, 2, 3, 4, 5]},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule
            }, '#querybuilder');
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[1].click();
        });
        it('In operator with textbox Checking', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['A', 'B'] }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule
            }, '#querybuilder');
            const inputObj: any = queryBuilder.element.querySelectorAll('.e-rule-value input.e-control')[0].ej2_instances[0];
            inputObj.element.value = 'A, B, C';
            const keyEvent = document.createEvent('KeyboardEvents');
            Object.defineProperty(keyEvent, 'target', {writable: false, value: inputObj.element});
            inputObj.inputHandler(keyEvent);
        });
        it('Date value Checking', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'},
                {field: 'Date', label: 'Date', type: 'date'}
            ];
            const arrRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': ['12/2/2021', '12/3/2021'] }
                ]
            };
            const arrRule1: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': '12/2/2021' }
                ]
            };
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'equal', 'value': '12/2/2021' }
                ]
            };
            const betweenRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': '12/2/2021' }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule
            }, '#querybuilder');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            expect(queryBuilder.rule.rules[0].value).toEqual(null);
            queryBuilder.setRules(arrRule);
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            expect(queryBuilder.rule.rules[0].value[0]).toEqual(null);
            queryBuilder.setRules(arrRule1);
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            expect(queryBuilder.rule.rules[0].value[0]).toEqual(null);
            queryBuilder.setRules(betweenRule);
            const inputObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value .e-control').ej2_instances;
            inputObj[0].value = new Date();
            inputObj[0].dataBind();
        });
        it('Date with Format Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'isnull', 'value': null }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: dateFormatData,
                rule: valRule
            }, '#querybuilder');
            let fieldElem: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            fieldElem = queryBuilder.element.querySelector('.e-rule-operator input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[1].click();
        });
        it('Predicate Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'isnull', 'value': null }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: boolData,
                rule: valRule
            }, '#querybuilder');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('isnull');
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[11].click();
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('isnotnull');
            queryBuilder.element.querySelector('.e-removerule').click();
            queryBuilder.addRules([{ 'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['Nancy'] }], 'group0');
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule1_operatorkey_options').querySelectorAll('li');
            itemsCln[10].click();
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('equal');
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule1_operatorkey_options').querySelectorAll('li');
            itemsCln[11].click();
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('notequal');
            queryBuilder.setRulesFromSql('Date BETWEEN \'1/12/2021\' AND \'2/12/2021\'');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql('Date NOT BETWEEN \'1/12/2021\' AND \'2/12/2021\'');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('lessthan');
            queryBuilder.setRulesFromSql('Category IN(\'S\', \'R\')');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('equal');
            queryBuilder.setRulesFromSql('Category NOT IN(\'S\', \'R\')');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('notequal');
            queryBuilder.setRulesFromSql('Date BETWEEN \'1/12/2021\' AND \'2/12/2021\' OR Date = \'1/12/2021\'');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql('Category IN(\'S\', \'R\') OR Category IN(\'S\', \'R\')');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('equal');
            queryBuilder.setRulesFromSql('Date = \'1/12/2021\' AND Date = \'3/12/2021\'');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql('Date = \'1/12/2021\' OR Date = \'3/12/2021\'');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql('TaskID IN (4,5) OR (Category LIKE (\'ALFKI%\'))');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[1].operator).toEqual('startswith');
            queryBuilder.setRulesFromSql('(Category LIKE (\'ALFKI%\')) OR (TaskID = 0)');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('startswith');
            queryBuilder.setRulesFromSql('(Date = null)');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('equal');
            queryBuilder.setRulesFromSql('Category NOT LIKE (\'%ALFKI%\') OR Category NOT LIKE (\'%ALFKI%\')');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('doesnotcontain');
            queryBuilder.setRulesFromSql('Category LIKE (\'ALFKI%\') OR TaskID = 0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('startswith');
            queryBuilder.setRulesFromSql('() AND Category LIKE (\'sda%\')');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('startswith');
            queryBuilder.setRulesFromSql('() OR Category LIKE (\'sda%\')');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('startswith');
        });
        it('Default Value Checking', () => {
            const formatObj: FormatObject = {skeleton: 'yMd'};
            const valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'in', 'value': ['Nancy']},
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [5] },
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1 }
                ]
            };
            const filterColl: ColumnsModel[] = [
                {field: 'FirstName', label: 'First Name', type: 'string', value: 'Nancy'},
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 1},
                {field: 'LastName', label: 'Last Name', type: 'string', value: ['Davolio']},
                {field: 'BirthDate', label: 'BirthDate', type: 'date', format: 'short', value: '02/17/2021'},
                {field: 'HireDate', label: 'HireDate', type: 'date', format: formatObj, value: new Date(704692800000)},
                {field: 'Status', label: 'Status', type: 'boolean', value: true},
                {field: 'ValueStatus', label: 'ValueStatus', type: 'boolean', value: 'true', values: ['true', 'false']},
                {field: 'FalseStatus', label: 'FalseStatus', type: 'boolean', value: false}
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: filterColl,
                rule: valRule
            }, '#querybuilder');
            let filterElem: DropDownList = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[1].ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule1_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[2].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule2_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[2].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule2_filterkey_options').querySelectorAll('li');
            itemsCln[3].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[2].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule2_filterkey_options').querySelectorAll('li');
            itemsCln[4].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[2].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule2_filterkey_options').querySelectorAll('li');
            itemsCln[5].click();
            filterElem = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[2].ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule2_filterkey_options').querySelectorAll('li');
            itemsCln[6].click();
            queryBuilder.addRules([{ 'label': 'FalseStatus', 'field': 'FalseStatus', 'type': 'boolean', 'operator': 'equal', 'value': undefined }], 'group0');
            queryBuilder.addRules([{ 'label': 'ValueStatus', 'field': 'ValueStatus', 'type': 'boolean', 'operator': 'equal', 'value': undefined }], 'group0');
            queryBuilder.addRules([{ 'label': 'ValueStatus', 'field': 'ValueStatus', 'type': undefined, 'operator': 'equal', 'value': true }], 'group0');
        });
        it('Is Empty Checking', () => {
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'isempty', 'value': ''}
                ]
            };
            const filterColl: ColumnsModel[] = [
                {field: 'FirstName', label: 'First Name', type: 'string'},
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'LastName', label: 'Last Name', type: 'string'}
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: filterColl,
                rule: valRule
            }, '#querybuilder');
            const filterElem: DropDownList = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[0].ej2_instances;
            filterElem[0].showPopup();
            const itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
        });
    });
    describe('Platform Specific Column Template', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider e-template"></div></div>';
            document.body.appendChild(template);
            const boolTemplate: Element = createElement('script', { id: 'boolTemplate' });
            boolTemplate.setAttribute('type', 'text/x-template');
            boolTemplate.innerHTML = '<div class="e-booean-value"><input id = ${ruleID}_valuekey0 class="e-template"></div></div>';
            document.body.appendChild(boolTemplate);
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Template Checking', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', template: '#template' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'IsHeader', label: 'IsHeader', type: 'boolean', template: '#boolTemplate' }
            ];
            const valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                },
                {
                    'label': 'IsHeader',
                    'field': 'IsHeader',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': true
                }]
            };

            let valueObj: Slider;
            let checkObj: CheckBox;
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                rule: valRule,
                actionBegin: (args: any) => {
                    if (args.requestType === 'value-template-create') {
                        if (args.rule.field === 'EmployeeID') {
                            const defaultNumber: number = 31;
                            if (args.rule.value === '') {
                                args.rule.value = defaultNumber;
                            }
                            valueObj = new Slider({
                                value: args.rule.value as number, min: 30, max: 50,
                                ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                                change: (e: any) => {
                                    const elem: HTMLElement = valueObj.element;
                                    queryBuilder.notifyChange(e.value, elem, 'value');
                                }
                            });
                            valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                        } else {
                            checkObj = new CheckBox({
                                checked: args.rule.value as boolean,
                                change: (e: any) => {
                                    const elem: HTMLElement = valueObj.element;
                                    queryBuilder.notifyChange(e.value, elem, 'value');
                                }
                            });
                            checkObj.appendTo('#' + args.ruleID + '_valuekey0');
                        }
                    }
                }
            }, '#querybuilder');
            queryBuilder.lockGroup('group0');
            queryBuilder.lockGroup('group0');
            const slider: Slider = queryBuilder.element.querySelector('.e-control.e-slider').ej2_instances[0];
            slider.value = 30; slider.dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual(30);
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            queryBuilder.destroy();
        });
        it('Template Checking - Other Platforms', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', template: '#template' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'IsHeader', label: 'IsHeader', type: 'boolean', template: '#boolTemplate' }
            ];
            const valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                },
                {
                    'label': 'IsHeader',
                    'field': 'IsHeader',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': true
                }]
            };

            let valueObj: Slider;
            let checkObj: CheckBox;
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                rule: valRule,
                actionBegin: (args: any) => {
                    if (args.requestType === 'value-template-create') {
                        if (args.rule.field === 'EmployeeID') {
                            const defaultNumber: number = 31;
                            if (args.rule.value === '') {
                                args.rule.value = defaultNumber;
                            }
                            valueObj = new Slider({
                                value: args.rule.value as number, min: 30, max: 50,
                                ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                                change: (e: any) => {
                                    const elem: HTMLElement = valueObj.element;
                                    queryBuilder.notifyChange(e.value, elem, 'value');
                                }
                            });
                            valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                        } else {
                            checkObj = new CheckBox({
                                checked: args.rule.value as boolean,
                                change: (e: any) => {
                                    const elem: HTMLElement = valueObj.element;
                                    queryBuilder.notifyChange(e.value, elem, 'value');
                                }
                            });
                            checkObj.appendTo('#' + args.ruleID + '_valuekey0');
                        }
                    }
                }
            }, '#querybuilder');
            queryBuilder.lockGroup('group0');
            queryBuilder.lockGroup('group0');
            const slider: Slider = queryBuilder.element.querySelector('.e-control.e-slider').ej2_instances[0];
            slider.value = 30; slider.dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual(30);
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            (queryBuilder as any).isReact = true;
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            (queryBuilder as any).isReact = false;
            filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            (queryBuilder as any).isAngular = true;
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            (queryBuilder as any).isAngular = false;
            filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            (queryBuilder as any).isVue3 = true;
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            (queryBuilder as any).isVue3 = false;
            queryBuilder.destroy();
        });
    });

    describe('Platform Specific Date Column Template', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            let template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-date-value"><input id = ${ruleID}_valuekey0 class="e-date1 e-template"/></div>';
            document.body.appendChild(template);
            template = createElement('script', { id: 'betweentemplate' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-date-value"><input id = ${ruleID}_valuekey0 class="e-date1 e-template"/><input id = ${ruleID}_valuekey1 class="e-date1 e-template"/></div>';
            document.body.appendChild(template);
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Template Checking', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'Date', label: 'Date', type: 'date', operators: [{key: 'equal', value: 'equal'}, {key: 'between', value: 'between'}], template: '#template' },
                { field: 'BirthDate', label: 'BirthDate', type: 'date', operators: [{ key: 'between', value: 'between' }], template: '#betweentemplate' }
            ];
            const valRule: RuleModel = {'condition': 'and',
                'rules': [
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 32 },
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'equal', 'value': '12/10/2021' },
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': ['12/10/2021', '12/11/2021'] },
                    { 'label': 'BirthDate', 'field': 'BirthDate', 'type': 'date', 'operator': 'between', 'value': ['12/10/2021', '12/11/2021'] }
                ]
            };
            let dateRangeObj: DateRangePicker;
            let dateObj: DatePicker;
            let dateObj2: DatePicker;
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                rule: valRule,
                actionBegin: (args: any) => {
                    if (args.requestType === 'value-template-create') {
                        if (args.rule.field === 'Date') {
                            if (args.rule.operator === 'between') {
                                dateRangeObj = new DateRangePicker({
                                    placeholder: 'Select Range',
                                    change: (e: any) => {
                                        const elem: HTMLElement = dateRangeObj.element;
                                        queryBuilder.notifyChange(e.value as Date[], elem, 'value');
                                    }
                                });
                                dateRangeObj.appendTo('#' + args.ruleID + '_valuekey0');
                            } else {
                                dateObj = new DatePicker({
                                    placeholder: 'Select Range',
                                    change: (e: any) => {
                                        const elem: HTMLElement = dateObj.element;
                                        queryBuilder.notifyChange(e.value as Date, elem, 'value');
                                    }
                                });
                                dateObj.appendTo('#' + args.ruleID + '_valuekey0');
                            }
                        } else {
                            let dateArr = [];
                            dateObj = new DatePicker({
                                placeholder: 'Select Range',
                                change: (e: any) => {
                                    const elem: HTMLElement = dateObj.element;
                                    dateArr = [];
                                    dateArr.push(e.value); dateArr.push(dateObj2.value);
                                    queryBuilder.notifyChange(dateArr, elem, 'value');
                                }
                            });
                            dateObj2 = new DatePicker({
                                placeholder: 'Select Range',
                                change: (e: any) => {
                                    const elem: HTMLElement = dateObj.element;
                                    dateArr = [];
                                    dateArr.push(dateObj.value); dateArr.push(e.value);
                                    queryBuilder.notifyChange(dateArr, elem, 'value');
                                }
                            });
                            dateObj.appendTo('#' + args.ruleID + '_valuekey0');
                            dateObj2.appendTo('#' + args.ruleID + '_valuekey1');
                        }
                    }
                }
            }, '#querybuilder');
            let datePObj: DatePicker = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[1].ej2_instances;
            datePObj[0].value = new Date('02/10/2021');
            datePObj[0].dataBind();
            const dateRngObj: DateRangePicker = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[2].ej2_instances;
            dateRngObj[0].value = [new Date('02/10/2021'), new Date('02/11/2021')];
            dateRngObj[0].dataBind();
            datePObj = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[3].ej2_instances;
            datePObj[0].value = new Date('02/10/2021');
            datePObj[0].dataBind();
            queryBuilder.deleteRules(['group0_rule1']);
        });
    });
    describe('Platform Specific Rule Template', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-rule e-rule-template"><div class="e-rule-filter"><input id = ${ruleID}_filterkey class="e-filter-input"></div><div class="e-rule-operator e-operator"><input id = ${ruleID}_operatorkey class="e-operator-input"></div><div class="e-value e-rule-value e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider"></div></div><div class="e-rule-btn"><button class="e-removerule e-rule-delete e-css e-btn e-small e-round"><span class="e-btn-icon e-icons e-delete-icon"/></button></div></div>';
            document.body.appendChild(template);
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
    });
    describe('Platform Specific Header Template', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const template: Element = createElement('script', { id: 'headerTemplate' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-groupheader">${if(notCondition !== undefined)}<input type="checkbox" class="e-not" id="${ruleID}_notoption">${/if}<input type="text" class= "e-custom-group-btn" id="${ruleID}_cndtnbtn"><button id = "${ruleID}_addbtn" class="e-add-btn"></button>${if(ruleID !== "querybuilder_group0")}<button id="dltbtn" class="e-btn e-delete-btn e-small e-round e-icon-btn"><span class = "e-btn-icon e-icons e-delete-icon"></span></button>${/if}</div>';
            document.body.appendChild(template);
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Template Checking', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            const valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableNotCondition: true,
                columns: customFieldData,
                rule: valRule,
                headerTemplate: '#headerTemplate',
                actionBegin: (args: any) => {
                    if (args.requestType === 'header-template-create') {
                        const checkBoxObj: CheckBox = new CheckBox({
                            label: 'NOT', checked: args.notCondition,
                            change: function(e: any){
                                queryBuilder.notifyChange(e.checked, e.event.target, 'not');
                            }
                        });
                        checkBoxObj.appendTo('#' + args.ruleID + '_notoption');
                        const ds: { [key: string]: Object }[] = [{'key': 'AND', 'value': 'and'}, {'key': 'OR', 'value': 'or'}];
                        const btnObj: DropDownList = new DropDownList({
                            dataSource: ds, fields: { text: 'key', value: 'value' },
                            value: args.condition, cssClass: 'e-custom-group-btn e-active-toggle',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'condition');
                            }
                        });
                        btnObj.appendTo('#' + args.ruleID + '_cndtnbtn');
                        const ddbitems: ItemModel[] = [
                            { text: 'AddGroup', iconCss: 'e-icons e-add-icon e-addgroup' },
                            { text: 'AddCondition', iconCss: 'e-icons e-add-icon e-addrule' }
                        ];
                        const addbtn: DropDownButton = new DropDownButton({
                            items: ddbitems,
                            cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                            iconCss: 'e-icons e-add-icon',
                            select: function(event: any) {
                                const addbtn: Element = closest(event.element, '.e-dropdown-popup');  const ddb: string[] = addbtn.id.split('_');
                                if (event.item.text === 'AddGroup') {
                                    queryBuilder.addGroups([{condition: 'and', 'rules': [{}], not: false}], ddb[1]);
                                } else if (event.item.text === 'AddCondition') {
                                    queryBuilder.addRules([{}], ddb[1]);
                                }
                            }
                        });
                        addbtn.appendTo('#' + args.ruleID + '_addbtn');
                        const deleteGroup: Element =  document.getElementById(args.ruleID).querySelector('.e-delete-btn');
                        if (deleteGroup) {
                            (deleteGroup as HTMLElement).onclick = function (e: any) {
                                queryBuilder.deleteGroup(closest(e.target.offsetParent, '.e-group-container'));
                            };
                        }
                    }
                }
            }, '#querybuilder');
            document.getElementById('querybuilder_group0_addbtn').click();
            let itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_addbtn-popup').querySelectorAll('li');
            itemCln[0].click();
            (<HTMLElement>document.querySelector('#querybuilder_group0_notoption')).click();
            const condtion: DropDownList = queryBuilder.element.querySelector('#querybuilder_group0_cndtnbtn').ej2_instances[0];
            condtion.showPopup();
            itemCln = document.getElementById('querybuilder_group0_cndtnbtn_popup').querySelectorAll('li');
            itemCln[1].click();
        });

        it('Template Checking with seperate connector', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            const valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableNotCondition: true,
                columns: customFieldData,
                enableSeparateConnector: true,
                rule: valRule,
                headerTemplate: '#headerTemplate',
                actionBegin: (args: any) => {
                    if (args.requestType === 'header-template-create') {
                        const checkBoxObj: CheckBox = new CheckBox({
                            label: 'NOT', checked: args.notCondition,
                            change: function(e: any){
                                queryBuilder.notifyChange(e.checked, e.event.target, 'not');
                            }
                        });
                        checkBoxObj.appendTo('#' + args.ruleID + '_notoption');
                        const ds: { [key: string]: Object }[] = [{'key': 'AND', 'value': 'and'}, {'key': 'OR', 'value': 'or'}];
                        const btnObj: DropDownList = new DropDownList({
                            dataSource: ds, fields: { text: 'key', value: 'value' },
                            value: args.condition, cssClass: 'e-custom-group-btn e-active-toggle',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'condition');
                            }
                        });
                        btnObj.appendTo('#' + args.ruleID + '_cndtnbtn');
                        const ddbitems: ItemModel[] = [
                            { text: 'AddGroup', iconCss: 'e-icons e-add-icon e-addgroup' },
                            { text: 'AddCondition', iconCss: 'e-icons e-add-icon e-addrule' }
                        ];
                        const addbtn: DropDownButton = new DropDownButton({
                            items: ddbitems,
                            cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                            iconCss: 'e-icons e-add-icon',
                            select: function(event: any) {
                                const addbtn: Element = closest(event.element, '.e-dropdown-popup');  const ddb: string[] = addbtn.id.split('_');
                                if (event.item.text === 'AddGroup') {
                                    queryBuilder.addGroups([{condition: 'and', 'rules': [{}], not: false}], ddb[1]);
                                } else if (event.item.text === 'AddCondition') {
                                    queryBuilder.addRules([{}], ddb[1]);
                                }
                            }
                        });
                        addbtn.appendTo('#' + args.ruleID + '_addbtn');
                        const deleteGroup: Element =  document.getElementById(args.ruleID).querySelector('.e-delete-btn');
                        if (deleteGroup) {
                            (deleteGroup as HTMLElement).onclick = function (e: any) {
                                queryBuilder.deleteGroup(closest(e.target.offsetParent, '.e-group-container'));
                            };
                        }
                    }
                }
            }, '#querybuilder');
            document.getElementById('querybuilder_group0_addbtn').click();
            let itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_addbtn-popup').querySelectorAll('li');
            itemCln[0].click();
            (<HTMLElement>document.querySelector('#querybuilder_group0_notoption')).click();
            const condtion: DropDownList = queryBuilder.element.querySelector('#querybuilder_group0_cndtnbtn').ej2_instances[0];
            condtion.showPopup();
            itemCln = document.getElementById('querybuilder_group0_cndtnbtn_popup').querySelectorAll('li');
            itemCln[1].click();
        });
    });
    describe('model binding support', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider e-template"></div></div>';
            document.body.appendChild(template);
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });
        it('Model Binding with DataSource', () => {
            const cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101 },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan'},
                { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM'},
                { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy', value: '2/07/1991' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'}
            ];
            const iRules: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr.'},
                    {'label': 'FirstName', 'field': 'FirstName', 'type': 'string', 'operator': 'equal', 'value': 'Nancy'},
                    {'label': 'FirstName', 'field': 'FirstName', 'type': 'string', 'operator': 'in', 'value': ['Nancy']},
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1},
                    {'label': 'HireDate', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '1/1/2021'}
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: cData,
                rule: iRules,
                fieldModel: {
                    allowFiltering: true
                },
                operatorModel: {
                    allowFiltering: true
                },
                valueModel: {
                    numericTextBoxModel: {
                        cssClass: 'e-custom'
                    },
                    multiSelectModel: {
                        cssClass: 'e-custom'
                    },
                    datePickerModel: {
                        cssClass: 'e-custom'
                    },
                    textBoxModel: {
                        cssClass: 'e-custom'
                    },
                    radioButtonModel: {
                        cssClass: 'e-custom'
                    }
                }
            }, '#querybuilder');
        });
        it('Model Binding without DataSource', () => {
            const cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101 },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan'},
                { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM'},
                { field: 'HireDate', label: 'HireDate', type: 'date', value: '2/07/1991' },
                { field: 'Date', label: 'Date', type: 'date', format: 'short', value: '2/07/1991' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'}
            ];
            const iRules: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'Title Of Courtesy', 'field': 'TitleOfCourtesy', 'type': 'boolean', 'operator': 'equal', 'value': 'Mr.'},
                    {'label': 'FirstName', 'field': 'FirstName', 'type': 'string', 'operator': 'equal', 'value': 'Nancy'},
                    {'label': 'FirstName', 'field': 'FirstName', 'type': 'string', 'operator': 'in', 'value': ['Nancy']},
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1, 2, 3]},
                    {'label': 'HireDate', 'field': 'HireDate', 'type': 'date', 'operator': 'equal', 'value': '1/1/2021'},
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'equal', 'value': '1/1/2021'}
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: cData,
                rule: iRules,
                fieldModel: {
                    allowFiltering: true
                },
                operatorModel: {
                    allowFiltering: true
                },
                valueModel: {
                    numericTextBoxModel: {
                        cssClass: 'e-custom'
                    },
                    multiSelectModel: {
                        cssClass: 'e-custom'
                    },
                    datePickerModel: {
                        cssClass: 'e-custom'
                    },
                    textBoxModel: {
                        cssClass: 'e-custom'
                    },
                    radioButtonModel: {
                        cssClass: 'e-custom'
                    }
                }
            }, '#querybuilder');
        });
        it('Complex Databinding Support with datasource', () => {
            const importRules: RuleModel = {
                condition: 'and',
                rules: [
                    { label: 'ID', field: 'Employee.ID', type: 'string', operator: 'equal', value: 0 },
                    { label: 'Last Name', field: 'Name.LastName', type: 'string', operator: 'contains', value: 'malan' },
                    { condition: 'or', rules: [
                        { label: 'City', field: 'Country.State.City', operator: 'startswith', type: 'string', value: 'U' },
                        { label: 'Region', field: 'Country.Region', operator: 'endswith', type: 'string', value: 'c' },
                        { label: 'Name', field: 'Country.Name', operator: 'isnotempty' }
                    ]}
                ]
            };
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            queryBuilder = new QueryBuilder({
                dataSource: complexBindingData,
                separator: '.',
                columns: columns,
                rule: importRules,
                enableNotCondition: true
            }, '#querybuilder');
            const filter: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter.showPopup();
            const itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemCln[1].click();
            queryBuilder.reset();
            queryBuilder.setRulesFromSql('Employee.ID = 0 AND Name.LastName LIKE (\'%malan%\') AND (Country.State.City LIKE (\'U%\') AND Country.Region LIKE (\'%c\') AND Country.Name IS NOT EMPTY)');
            queryBuilder.reset();
            queryBuilder.setRules(importRules);
        });
        it('Complex Databinding Support without datasource', () => {
            const importRules: RuleModel = {
                condition: 'and',
                rules: [
                    { label: 'ID', field: 'Employee.ID', type: 'string', operator: 'equal', value: 0 },
                    { label: 'Last Name', field: 'Name.LastName', type: 'string', operator: 'contains', value: 'malan' },
                    { condition: 'or', rules: [
                        { label: 'City', field: 'Country.State.City', operator: 'startswith', type: 'string', value: 'U' },
                        { label: 'Region', field: 'Country.Region', operator: 'endswith', type: 'string', value: 'c' },
                        { label: 'Name', field: 'Country.Name', operator: 'isnotempty' }
                    ]}
                ]
            };
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            queryBuilder = new QueryBuilder({
                separator: '.',
                columns: columns,
                rule: importRules,
                enableNotCondition: true
            }, '#querybuilder');
        });
        it('Complex Databinding Support without columns', () => {
            const importRules: RuleModel = {
                condition: 'and',
                rules: [
                    { label: 'ID', field: 'Employee.ID', type: 'string', operator: 'equal', value: 0 },
                    { label: 'Last Name', field: 'Name.LastName', type: 'string', operator: 'contains', value: 'malan' },
                    { condition: 'or', rules: [
                        { label: 'City', field: 'Country.State.City', operator: 'startswith', type: 'string', value: 'U' },
                        { label: 'Region', field: 'Country.Region', operator: 'endswith', type: 'string', value: 'c' },
                        { label: 'Name', field: 'Country.Name', operator: 'isnotempty' }
                    ]}
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: complexBindingData,
                separator: '.',
                rule: importRules,
                enableNotCondition: true
            }, '#querybuilder');
        });
        it('Complex Databinding Support - Dropdown Tree', () => {
            const importRules: RuleModel = {
                condition: 'and',
                rules: [
                    { label: 'ID', field: 'Employee.ID', type: 'string', operator: 'equal', value: 0 },
                    { label: 'Last Name', field: 'Name.LastName', type: 'string', operator: 'contains', value: 'malan' },
                    { condition: 'or', rules: [
                        { label: 'City', field: 'Country.State.City', operator: 'startswith', type: 'string', value: 'U' },
                        { label: 'Region', field: 'Country.Region', operator: 'endswith', type: 'string', value: 'c' },
                        { label: 'Name', field: 'Country.Name', operator: 'isnotempty' }
                    ]}
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: complexBindingData,
                separator: '.',
                rule: importRules,
                enableNotCondition: true,
                readonly: true,
                fieldMode: 'DropdownTree'
            }, '#querybuilder');
            const inpElem: HTMLElement = document.getElementById('querybuilder_group0_rule0_filterkey');
            (queryBuilder as any).changeField({ element: inpElem, e: null, isInteracted: true, name: 'change', oldValue: ['Employee.ID'], value: ['Employee.DOB']});
        });
        it('Complex Databinding Support - Dropdown Tree with angular template', (done) => {
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number', template: '#template'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexBindingData,
                columns: columns,
                separator: '.',
                fieldMode: 'DropdownTree',
                fieldModel: { allowFiltering: true },
                rule: {
                    condition: 'and',
                    rules: [{
                        label: 'ID',
                        field: 'Employee.ID', // Ensure a valid field path is set
                        type: 'number',
                        operator: 'equal',
                        value: 31
                    }]
                },
                actionBegin: (args: any) => {
                    if (args.requestType === 'value-template-create') {
                        if (args.rule.field === 'ID') {
                            const defaultNumber: number = 31;
                            if (args.rule.value === '') {
                                args.rule.value = defaultNumber;
                            }
                            valueObj = new Slider({
                                value: args.rule.value as number, min: 30, max: 50,
                                ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                                change: (e: any) => {
                                    const elem: HTMLElement = valueObj.element;
                                    queryBuilder.notifyChange(e.value, elem, 'value');
                                }
                            });
                            valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                        }
                    }
                }
            }, '#querybuilder');
            setTimeout(() => {
                queryBuilder.isAngular = true;
                // Make sure filter exists before trying to access it
                const filter = queryBuilder.element.querySelector('.e-filter-input.e-control');
                if (filter && filter.ej2_instances && filter.ej2_instances[0]) {
                    const ddlFilter = filter.ej2_instances[0];
                    ddlFilter.showPopup();
                    // Make sure the dropdown tree popup is open
                    setTimeout(() => {
                        const input = document.querySelector('.e-qb-ddt.e-popup-open .e-textbox');
                        if (input) {
                            queryBuilder.dropdownTreeFiltering({
                                cancel: false,
                                text: 'h',
                                event: {srcElement: input}
                            });
                        }
                        done();
                    }, 100);
                }
            }, 100);
        });
        it('Complex Databinding Support - Dropdown Tree with angular template with operator change', (done) => {
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number', template: '#template'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            let valueObj: Slider;
            const importRules: RuleModel = {
                condition: 'and',
                rules: [{
                    label: 'ID',
                    field: 'Employee.ID',
                    type: 'string',
                    operator: 'equal',
                    value: 0
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: complexBindingData,
                columns: columns,
                separator: '.',
                fieldMode: 'DropdownTree',
                rule: importRules,
                actionBegin: (args: any) => {
                    if (args.requestType === 'value-template-create') {
                        if (args.rule.field === 'ID') {
                            const defaultNumber: number = 31;
                            if (args.rule.value === '') {
                                args.rule.value = defaultNumber;
                            }
                            valueObj = new Slider({
                                value: args.rule.value as number, min: 30, max: 50,
                                ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                                change: (e: any) => {
                                    const elem: HTMLElement = valueObj.element;
                                    queryBuilder.notifyChange(e.value, elem, 'value');
                                }
                            });
                            valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                        }
                    }
                }
            }, '#querybuilder');
            setTimeout(() => {
                queryBuilder.isAngular = true;
                const operatorElem = queryBuilder.element.querySelector('.e-operator .e-control');
                if (operatorElem && operatorElem.ej2_instances && operatorElem.ej2_instances[0]) {
                    operatorElem.ej2_instances[0].showPopup();
                    setTimeout(() => {
                        const optionsElement = document.getElementById('querybuilder_group0_rule0_operatorkey_options');
                        if (optionsElement) {
                            const itemsCln = optionsElement.querySelectorAll('li');
                            if (itemsCln.length > 2) {
                                itemsCln[2].click();
                                setTimeout(() => {
                                    const childContent = queryBuilder.element.firstElementChild.children[0];
                                    const addBtn = select('.e-add-btn', childContent) as HTMLElement;
                                    if (addBtn) {
                                        addBtn.click();
                                        setTimeout(() => {
                                            const dropdown = document.querySelectorAll('.e-dropdown-popup.e-addrulegroup.e-popup-open');
                                            if (dropdown.length > 0 && selectAll('.e-item', dropdown[0]).length > 1) {
                                                (selectAll('.e-item', dropdown[0])[1] as HTMLElement).click();
                                            }
                                            done();
                                        }, 100);
                                    }
                                }, 100);
                            }
                        }
                    }, 100);
                }
            }, 100);
        });
    });
    describe('Customer_Bugs', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const template: Element = createElement('script', { id: 'headerTemplate' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-groupheader">${if(notCondition !== undefined)}<input type="checkbox" class="e-not" id="${ruleID}_notoption">${/if}<input type="text" class= "e-custom-group-btn" id="${ruleID}_cndtnbtn"><button id = "${ruleID}_addbtn" class="e-add-btn"></button>${if(ruleID !== "querybuilder_group0")}<button id="dltbtn" class="e-btn e-delete-btn e-small e-round e-icon-btn"><span class = "e-btn-icon e-icons e-delete-icon"></span></button>${/if}</div>';
            document.body.appendChild(template);
            const ageTemplate: Element = createElement('script', { id: 'ageTemplate' });
            ageTemplate.setAttribute('type', 'text/x-template');
            ageTemplate.innerHTML = '<div class="e-rule e-rule-template"><div class="e-rule-filter"><input id = ${ruleID}_filterkey class="e-filter-input"></div><div class="e-rule-subfilter"><input id = ${ruleID}_subfilterkey class="e-sub-filter-input"></div><div class="e-value e-rule-value e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider"></div></div><div class="e-rule-btn"><button class="e-removerule e-rule-delete e-css e-btn e-small e-round"><span class="e-btn-icon e-icons e-delete-icon"/></button></div></div>';
            document.body.appendChild(ageTemplate);
        });
        afterEach(() => {
            if (queryBuilder.element) {
                remove(queryBuilder.element.nextElementSibling);
            }
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('EJ2-26551-Selected value not maintained properly for field checkbox in querybuilder', () => {
            const cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101 },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan'},
                { field: 'Title Of Courtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM'},
                { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy', value: '2/07/1991' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'},
                { field: 'City', label: 'City', type: 'string' , value: 'MS'}
            ];
            const iRules: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'Title Of Courtesy',
                    'field': 'Title Of Courtesy',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': ['Mr.']
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: cData,
                rule: iRules
            }, '#querybuilder');
            expect(queryBuilder.rule.rules[0].value).toEqual('Mr.');
            //Operator change
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            const itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[1].click();
            expect(operatorElem[0].value).toEqual('notequal');
            expect(queryBuilder.rule.rules[0].operator).toEqual('notequal');
            expect(queryBuilder.rule.rules[0].value).toEqual('Mr.');
            const radioBtnCln: NodeListOf<HTMLElement> = document.querySelectorAll('.e-radio');
            radioBtnCln[1].click();
            expect(queryBuilder.rule.rules[0].value).toEqual('Mrs.');
            itemsCln[0].click();
            expect(operatorElem[0].value).toEqual('equal');
            expect(queryBuilder.rule.rules[0].operator).toEqual('equal');
            expect(queryBuilder.rule.rules[0].value).toEqual('Mrs.');

            // repeat
            radioBtnCln[0].click();
            expect(queryBuilder.rule.rules[0].value).toEqual('Mr.');
            itemsCln[1].click();
            expect(operatorElem[0].value).toEqual('notequal');
            expect(queryBuilder.rule.rules[0].operator).toEqual('notequal');
            expect(queryBuilder.rule.rules[0].value).toEqual('Mr.');
        });

        it('EJ2-25995-To enable groupBy support for column field', () => {
            const cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101, category: 'Employee Details' },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan', category: 'Employee Details'},
                { field: 'Title Of Courtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.', category: 'Title Details' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM', category: 'Title Details'},
                { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy', value: '2/07/1991', category: 'Title Details' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'},
                { field: 'City', label: 'City', type: 'string' , value: 'MS'}
            ];
            const iRules: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'Title Of Courtesy',
                    'field': 'Title Of Courtesy',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': ['Mr.']
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: cData,
                rule: iRules
            }, '#querybuilder');
            //Change the field
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            filterElem.showPopup();
            const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            expect(items[0].textContent).toEqual('Employee Details');
            expect(items[3].textContent).toEqual('Title Details');
            expect(items[7].textContent).toEqual('Other Fields');
        });

        it('EJ2-50725 - setRules not works for header template', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            const valRule: RuleModel = {'condition': 'or', 'not': true,
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                },
                {
                    'label': 'LastName',
                    'field': 'LastName',
                    'type': 'string',
                    'operator': 'equal',
                    'value': 'vinit'
                },
                {
                    'condition': 'and',
                    'rules': [{
                        'label': 'Employee ID',
                        'field': 'EmployeeID',
                        'type': 'number',
                        'operator': 'equal',
                        'value': 32
                    }]
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableNotCondition: true,
                columns: customFieldData,
                headerTemplate: '#headerTemplate',
                actionBegin: (args: any) => {
                    if (args.requestType === 'header-template-create') {
                        const checkBoxObj: CheckBox = new CheckBox({
                            label: 'NOT', checked: args.notCondition,
                            change: function(e: any){
                                queryBuilder.notifyChange(e.checked, e.event.target, 'not');
                            }
                        });
                        checkBoxObj.appendTo('#' + args.ruleID + '_notoption');
                        const ds: { [key: string]: Object }[] = [{'key': 'AND', 'value': 'and'}, {'key': 'OR', 'value': 'or'}];
                        const btnObj: DropDownList = new DropDownList({
                            dataSource: ds, fields: { text: 'key', value: 'value' },
                            value: args.condition, cssClass: 'e-custom-group-btn e-active-toggle',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'condition');
                            }
                        });
                        btnObj.appendTo('#' + args.ruleID + '_cndtnbtn');
                        const ddbitems: ItemModel[] = [
                            { text: 'AddGroup', iconCss: 'e-icons e-add-icon e-addgroup' },
                            { text: 'AddCondition', iconCss: 'e-icons e-add-icon e-addrule' }
                        ];
                        const addbtn: DropDownButton = new DropDownButton({
                            items: ddbitems,
                            cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                            iconCss: 'e-icons e-add-icon',
                            select: function(event: any) {
                                const addbtn: Element = closest(event.element, '.e-dropdown-popup');  const ddb: string[] = addbtn.id.split('_');
                                if (event.item.text === 'AddGroup') {
                                    queryBuilder.addGroups([{condition: 'and', 'rules': [{}], not: false}], ddb[1]);
                                } else if (event.item.text === 'AddCondition') {
                                    queryBuilder.addRules([{}], ddb[1]);
                                }
                            }
                        });
                        addbtn.appendTo('#' + args.ruleID + '_addbtn');
                        const deleteGroup: Element =  document.getElementById(args.ruleID).querySelector('.e-delete-btn');
                        if (deleteGroup) {
                            (deleteGroup as HTMLElement).onclick = function (e: any) {
                                queryBuilder.deleteGroup(closest(e.target.offsetParent, '.e-group-container'));
                            };
                        }
                    }
                }
            }, '#querybuilder');
            queryBuilder.setRules(valRule);
            expect(document.querySelector('#querybuilder_group0_notoption').nextElementSibling.classList.contains('e-check')).toEqual(true);
            expect(queryBuilder.element.querySelector('#querybuilder_group0_cndtnbtn').value).toEqual('OR');
            queryBuilder.enableSeparateConnector = true;
            queryBuilder.isReact = true;
            queryBuilder.setRules(valRule);
            queryBuilder.isReact = false;
            queryBuilder.isAngular = true;
            queryBuilder.setRules(valRule);
            queryBuilder.isAngular = false;
            queryBuilder.isVue3 = true;
            queryBuilder.setRules(valRule);
            queryBuilder.isVue3 = false;
            queryBuilder.setRules(valRule);
        });

        it('EJ2-50550 - Rtl class not added for dropdown button popup', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            const iRules: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'FirstName',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'in'
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableRtl: true,
                columns: customFieldData,
                rule: iRules
            }, '#querybuilder');
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            expect(document.getElementsByClassName('e-item')[0].parentElement.classList.contains('e-rtl')).toBeTruthy();
            (document.getElementsByClassName('e-dropdown-btn')[0] as HTMLElement).click();
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            filterElem.showPopup();
            const ddlItems = document.getElementById('querybuilder_group0_rule0_filterkey_options').parentElement;
            expect(ddlItems.parentElement.classList.contains('e-rtl')).toBeTruthy();
            const multiObj: MultiSelect = queryBuilder.element.querySelector('.e-control.e-multiselect').ej2_instances[0];
            multiObj.showPopup();
            const msItems = document.getElementById('querybuilder_group0_rule0_valuekey0_options').parentElement;
            expect(msItems.parentElement.classList.contains('e-rtl')).toBeTruthy();
        });

        it('EJ2-51636 - Tooltip not destroyed while applying reset after validation', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];

            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableRtl: true,
                columns: customFieldData

            }, '#querybuilder');
            queryBuilder.validateFields();
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter input.e-control').ej2_instances;
            queryBuilder.reset();
            expect(filterElem[0].element.parentElement.classList.contains('e-tooltip')).toBeFalsy();
        });

        it('EJ2-62285 - Date type Between value not render properly while use setRulesFromSql method', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'EmployeeID', type: 'number' },
                { field: 'FirstName', label: 'FirstName', type: 'string' },
                { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
                { field: 'Title', label: 'Title', type: 'string' },
                {
                    field: 'HireDate', label: 'HireDate',
                    operators: [
                        {
                            key: 'Greater Than',
                            value: 'greaterthan'
                        },
                        {
                            key: 'Greater Than Or Equal',
                            value: 'greaterthanorequal'
                        },
                        {
                            key: 'Less Than',
                            value: 'lessthan'
                        },
                        {
                            key: 'Less Than Or Equal',
                            value: 'lessthanorequal'
                        },
                        {
                            key: 'Between',
                            value: 'between'
                        }
                    ] , type: 'date', format: 'dd/MM/yyyy'
                },
                { field: 'Country', label: 'Country', type: 'string' },
                { field: 'City', label: 'City', type: 'string' }
            ];

            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableRtl: true,
                columns: customFieldData
            }, '#querybuilder');
            queryBuilder.setRulesFromSql('FirstName = \'Keerthi\' AND HireDate BETWEEN \'01/08/2022\' AND \'05/08/2022\' AND Country = \'Erode\'');
            expect(queryBuilder.rule.rules[1].value).toEqual(['01/08/2022', '05/08/2022']);
        });

        it('EJ2-61503 - Value template not destroy properly when we use complex data source', () => {
            const dateTemplate: TemplateColumn = {
                create: () => {
                    return document.createElement('div');
                },
                destroy: (args: { elementId: string }) => {
                    const dropDownList: DropDownList = getComponent(
                        document.getElementById(args.elementId),
                        'dropdownlist'
                    ) as DropDownList;
                    if (dropDownList) {
                        dropDownList.destroy();
                    }
                },
                write: (args: {
                    elements: Element;
                    values: string[] | string;
                    operator: string;
                }) => {
                    const ds: string[] = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallet'];
                    const dropdownlistObj: DropDownList = new DropDownList({
                        dataSource: ds,
                        value: ds[1],
                        change: (e: any) => {
                            queryBuilder.notifyChange(e.itemData.value, e.element);
                        }
                    });
                    dropdownlistObj.appendTo('#' + args.elements.id);
                }
            };
            const customFieldData: ColumnsModel[] = [
                {
                    label: 'general',
                    field: 'general',
                    columns: [
                        {
                            label: 'date',
                            field: 'date',
                            type: 'date',
                            step: 0,
                            template: dateTemplate
                        },
                        {
                            label: 'title',
                            field: 'title',
                            type: 'string',
                            step: 0
                        },
                        {
                            label: 'code',
                            field: 'code',
                            type: 'string',
                            step: 0
                        }
                    ]
                },
                {
                    label: 'custom',
                    field: 'custom',
                    columns: [
                        {
                            label: 'custom_code',
                            field: 'custom_code',
                            type: 'string',
                            step: 1
                        },
                        {
                            label: 'custom_title',
                            field: 'custom_title',
                            type: 'string',
                            step: 1
                        },
                        {
                            label: 'custom_date',
                            field: 'custom_date',
                            type: 'date',
                            step: 1,
                            template: dateTemplate
                        }
                    ]
                }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                separator: '.',
                columns: customFieldData
            }, '#querybuilder');
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            filterElem.showPopup();
            const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            items[0].click();
            queryBuilder.rule.rules[0].value = 'Football';
            items[1].click();
            expect(queryBuilder.rule.rules[0].value).toEqual('');
        });

        it('EJ2-62916 - Custom operator not set properly when we set one field is a prefix of other field as number', () => {
            const customField = [
                {
                    field: '1',
                    label: 'Number field',
                    type: 'number'
                },
                {
                    field: '12',
                    label: 'Custom field',
                    type: 'string',
                    operators: [
                        { value: 'in', key: 'In' },
                        { value: 'notin', key: 'Not In' }
                    ]
                }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customField
            }, '#querybuilder');
            const filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            filterElem.showPopup();
            const items = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            items[1].click();
            const filterElem1 = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances[0];
            filterElem1.showPopup();
            const items1 = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            expect(items1.length).toEqual(2);
            expect(queryBuilder.rule.rules[0].operator).toEqual('in');
        });

        it('EJ2-62949 - Rule template rendering issue when add group/condition', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', ruleTemplate: '#template' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'City', label: 'City', type: 'string' }
            ];
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                columns: customFieldData,
                separator: '.',
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        const defaultNumber: number = 31;
                        const fieldObj: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns, // tslint:disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        const operatorObj: DropDownList = new DropDownList({
                            dataSource: [{key: 'equal', value: 'equal'}, {key:'between', value:'between'}, {key:'notbetween', value:'notbetween'}], // tslint:disable-line
                            fields: { text: 'key', value: 'value' },
                            value: args.rule.operator,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'operator');
                            }
                        });
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                const elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        operatorObj.appendTo('#' + args.ruleID + '_operatorkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            expect(queryBuilder.rule.rules[0].field).toEqual('');
            queryBuilder.addGroups([{condition: 'and', 'rules': [{}], not: false}], 'group0');
            expect(queryBuilder.rule.rules[0].field).toEqual('');
        });

        it('EJ2-66222 - GetValidRules method of query builder returns empty group', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData

            }, '#querybuilder');
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            filterElem.showPopup();
            const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            items[0].click();
            queryBuilder.addGroups([{condition: 'and', 'rules': [{}] }], 'group0');
            expect(queryBuilder.getValidRules().rules.length).toEqual(1);
        });

        it('EJ2-68596 - Value template issue with complex data binding of query builder', () => {
            const customFieldData: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number', ruleTemplate: '#ageTemplate'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', operators: [
                    {
                        key: 'Equal',
                        value: 'equal'
                    },
                    {
                        key: 'Not Equal',
                        value: 'equal'
                    }], columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                columns: customFieldData,
                separator: '.',
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        args.rule.operator = 'between';
                        const defaultNumber: number = 31;
                        const fieldObj: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns as any, // tslint:disable-line
                            fields: args.fields,
                            value: 'Employee',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        const fieldObj1: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns[0].columns, // eslint-disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                const elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        fieldObj1.appendTo('#' + args.ruleID + '_subfilterkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            expect(queryBuilder.rule.rules[0].field).toEqual('');
            const filter: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter.showPopup();
            const itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemCln[0].click();
            const slider: Slider = queryBuilder.element.querySelector('.e-control.e-slider').ej2_instances[0];
            slider.value = 40; slider.dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual(40);
            const filter1: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter1.showPopup();
            const itemCln1: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemCln1[1].click();
            expect(queryBuilder.rule.rules[0].field).toEqual('Name.FirstName');
        });
        it('EJ2-68596 - Value', () => {
            const customFieldData: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number', ruleTemplate: '#ageTemplate'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', operators: [
                    {
                        key: 'Equal',
                        value: 'equal'
                    },
                    {
                        key: 'Not Equal',
                        value: 'equal'
                    }], columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                columns: customFieldData,
                separator: '.',
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        args.rule.operator = 'between';
                        const defaultNumber: number = 31;
                        const fieldObj: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns as any, // tslint:disable-line
                            fields: args.fields,
                            value: 'Employee',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        const fieldObj1: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns[0].columns, // eslint-disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                const elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        fieldObj1.appendTo('#' + args.ruleID + '_subfilterkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            expect(queryBuilder.rule.rules[0].field).toEqual('');
            const filter: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter.showPopup();
            const itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            (<any>queryBuilder).isReact = true;
            itemCln[0].click();
        });
        it('EJ2-68596 - Value angular', () => {
            const customFieldData: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number', ruleTemplate: '#ageTemplate'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', operators: [
                    {
                        key: 'Equal',
                        value: 'equal'
                    },
                    {
                        key: 'Not Equal',
                        value: 'equal'
                    }], columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                columns: customFieldData,
                separator: '.',
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        args.rule.operator = 'between';
                        const defaultNumber: number = 31;
                        const fieldObj: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns as any, // tslint:disable-line
                            fields: args.fields,
                            value: 'Employee',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        const fieldObj1: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns[0].columns, // eslint-disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                const elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        fieldObj1.appendTo('#' + args.ruleID + '_subfilterkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            expect(queryBuilder.rule.rules[0].field).toEqual('');
            const filter: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter.showPopup();
            const itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            (<any>queryBuilder).isAngular = true;
            itemCln[0].click();
        });

        it('EJ2-68596 - Value vue', () => {
            const customFieldData: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number', ruleTemplate: '#ageTemplate'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', operators: [
                    {
                        key: 'Equal',
                        value: 'equal'
                    },
                    {
                        key: 'Not Equal',
                        value: 'equal'
                    }], columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                columns: customFieldData,
                separator: '.',
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        args.rule.operator = 'between';
                        const defaultNumber: number = 31;
                        const fieldObj: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns as any, // tslint:disable-line
                            fields: args.fields,
                            value: 'Employee',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        const fieldObj1: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns[0].columns, // eslint-disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                const elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        fieldObj1.appendTo('#' + args.ruleID + '_subfilterkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            expect(queryBuilder.rule.rules[0].field).toEqual('');
            const filter: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter.showPopup();
            const itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            (<any>queryBuilder).isVue3 = true;
            itemCln[0].click();
        });


        it('EJ2-68260 - Provided special character in SQL string support to query builder', (done) => {
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];

            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                separator: '.',
                columns: columns,
                enableNotCondition: true,
                fieldMode: 'DropdownTree'
            }, '#querybuilder');
            setTimeout(() => {
                queryBuilder.setRulesFromSql('Name.FirstName LIKE (\'Date.parse(\'yyyy-MM-dd\',\'1980-05-24\')%\')');
                expect(queryBuilder.rule.rules[0].value).toEqual('Date.parse(\'yyyy-MM-dd\',\'1980-05-24\')');
                done();
            }, 300);
        });

        it('EJ2-863630 - GetValidRules method of query builder returns empty array for in operator rule', (done) => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData

            }, '#querybuilder');
            setTimeout(() => {
                const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
                filterElem.showPopup();
                const items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
                items[0].click();
                const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances[0];
                operatorElem.showPopup();
                const itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
                itemsCln[8].click();
                expect(operatorElem.value).toEqual('in');
                expect(queryBuilder.getValidRules()).toEqual({});
                done();
            }, 1000);
        });

        it('EJ2-876239 - SetRulesFromSql method is not working while using a field name like Name = \'|_fn { keyword \' kFinishedProduct \'}_|\'', () => {
            const column: ColumnsModel [] = [
                { field: 'Name', label: 'Name', type: 'string'},
                { field: 'ID', label: '3', type: 'number'}
            ];
            queryBuilder = new QueryBuilder({
                columns: column
            }, '#querybuilder');
            queryBuilder.setRulesFromSql('Name = \'|_fn { keyword \' kFinishedProduct \'}_|\' OR ID = 8');
            expect(queryBuilder.getSqlFromRules(queryBuilder.rule)).toEqual('Name = \'|_fn { keyword \' kFinishedProduct \'}_|\' OR ID = 8');
        });

        it('EJ2 - 896995 - Operator is not set properly when using the addRules method', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRules
            }, '#querybuilder');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{ 'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'greaterthan', 'value': '2/10/2021' }], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('greaterthan');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{ 'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'lessthanorequal', 'value': '2/10/2021' }], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('lessthanorequal');
        });

        it('field name with number literal', () => {
            const column: ColumnsModel [] = [
                { field: 'Name', label: 'Name', type: 'number'},
                { field: 'ID', label: '3', type: 'number'}
            ];
            queryBuilder = new QueryBuilder({
                columns: column
            }, '#querybuilder');
            queryBuilder.setRulesFromSql('Name = 9 OR ID = 8');
            expect(queryBuilder.getSqlFromRules(queryBuilder.rule)).toEqual('Name = 9 OR ID = 8');
        });

        it('EJ2 - 898205 - While setting rule.value as an empty string the rule was not created in QueryBuilder', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: noValue
            }, '#querybuilder');
            expect(queryBuilder.getRule(document.getElementById('querybuilder_group0_rule0')).field).toEqual('DOB');
            expect(queryBuilder.getRule(document.getElementById('querybuilder_group0_rule0')).label).toEqual('DOB');
            expect(queryBuilder.getRule(document.getElementById('querybuilder_group0_rule0')).operator).toEqual('equal');
            expect(queryBuilder.getRule(document.getElementById('querybuilder_group0_rule0')).value).toEqual(null);
        });
        it('962413 - Rule values not update properly while operator changes in string type columns', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: {
                    'condition': 'and',
                    'rules': [
                        {
                            'label': 'Designation',
                            'field': 'Designation',
                            'type': 'string',
                            'operator': 'equal',
                            'value': 'Sales Manager'
                        }]
                }
            }, '#querybuilder');
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances[0];
            operatorElem.showPopup();
            const itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[4].click();
            expect(operatorElem.value).toEqual('contains');
            expect(queryBuilder.getValidRules()).not.toEqual({});
        });
        it('963454: The NOT operator value does not update properly based on values passed in the setRules method in the separator sample.', () => {
            const column: ColumnsModel [] = [
                { field: 'Name', label: 'Name', type: 'number'},
                { field: 'ID', label: 'ID', type: 'number'}
            ];
            queryBuilder = new QueryBuilder({
                columns: column,
                enableSeparateConnector: true,
                enableNotCondition: true
            }, '#querybuilder');
            const rules: RuleModel = {
                condition: 'and',
                rules: [
                    {
                        label: 'ID',
                        field: 'ID',
                        operator: 'equal',
                        type: 'number',
                        value: 1
                    },
                    {
                        condition: 'and',
                        rules: [
                            {
                                label: 'Name',
                                field: 'Name',
                                operator: 'equal',
                                type: 'string',
                                value: '17'
                            }
                        ],
                        not: true
                    }
                ],
                not: false
            };
            queryBuilder.setRules(rules);
            const toggleElems: NodeListOf<HTMLElement> = queryBuilder.element.querySelectorAll('.e-multiconnector.e-active-toggle');
            if (toggleElems) {
                expect(toggleElems.length).toEqual(1);
                expect((getComponent(toggleElems[0].querySelector('.e-checkbox') as HTMLElement, 'checkbox') as CheckBox).checked).toEqual(true);
            }
        });
        it('966473 - Validation message is not removed properly once the multi select value renders in QueryBuilder', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            const iRules: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'FirstName',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'in'
                }]
            };
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                allowValidation: true,
                rule: iRules
            }, '#querybuilder');
            queryBuilder.validateFields();
            const operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances[0];
            operatorElem.showPopup();
            const itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[10].click();
            expect(operatorElem.value).toEqual('isempty');
            expect(queryBuilder.element.querySelectorAll('.e-tooltip').length).toEqual(0);
        });
    });

    describe('CR Issue', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const buttonElement = document.createElement('button');
            buttonElement.setAttribute('id', 'button');
            document.body.appendChild(buttonElement);
            buttonElement.addEventListener('click', () => {
                queryBuilder.locale = 'de';
                queryBuilder.dataBind();
            });
	    const template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-rule e-rule-template"><div class="e-rule-filter"><input id = ${ruleID}_filterkey class="e-filter-input"></div><div class="e-rule-operator e-operator"><input id = ${ruleID}_operatorkey class="e-operator-input"></div><div class="e-value e-rule-value e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider"></div></div><div class="e-rule-btn"><button class="e-removerule e-rule-delete e-css e-btn e-small e-round"><span class="e-btn-icon e-icons e-delete-icon"/></button></div></div>';
            document.body.appendChild(template);
        });
        it('EJ2 - 96184 - When dynamically changing the locale property the custom operator was not set in QueryBuilder', () => {
            const columnData: ColumnsModel[] = [
                {
                    field: 'EmployeeID', label: 'EmployeeID', type: 'number', operators: [{ key: 'En-contains', value: 'contains' },
                        { key: 'Greater than', value: 'greaterthan' }]
                }
            ];
            const importRules = {
                'condition': 'and',
                'rules': [{
                    'label': 'EmployeeID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'contains',
                    'value': 1001
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                locale: 'en',
                rule: importRules
            });
            queryBuilder.appendTo('#querybuilder');
            const button = document.querySelector('#button') as HTMLButtonElement;
            button.click();
            const filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator input.e-control');
            expect(filterElem.value).toEqual('En-contains');
        });
        it('EJ2 - 349006 - Multi select component works with "In" operator for complex data binding', () => {
            const importRules: RuleModel = {
                condition: 'and',
                rules: [{
                    label: 'City',
                    field: 'Test.Country.State.City',
                    type: 'string',
                    operator: 'in',
                    value: ['Inirda', 'USA']
                }
                ]};
            const nestedColumns: ColumnsModel[] = [
                { field: 'Region', label: 'Region', type: 'string', values: ['A','B','C']},
                { field: 'Test', label: 'Test', columns :[
                    {field: 'Country', label: 'Country', columns : [
                        { field: 'State', label: 'State', columns : [
                            { field: 'City', label: 'City', type: 'string', values:['Inirda', 'USA']},
                            { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                        { field: 'Name', label: 'Name', type: 'string'}
                    ]}]
                },
                { field: 'Country', label: 'Country', type: 'string', columns: [
                    { field: 'India', label: 'India', type: 'string', values: ['Chennai', 'Mumbai'] }]
                }
            ];
            const queryBuilder = new QueryBuilder({
                separator: '.',
                columns: nestedColumns,
                rule: importRules
            }, '#querybuilder');
            expect((queryBuilder as any).element.querySelector('.e-multiselect')).toBeTruthy();
        });
        it('EJ2 - 80058 - String type between values not update properly in query builder rules', () => {
            const columnData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string',
                    operators: [{ key: 'Equal', value: 'equal' },
                        { key: 'Between', value: 'between' }, { key: 'Not Between', value: 'notbetween' }] },
                { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
                { field: 'Title', label: 'Title', type: 'string' },
                { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
                { field: 'Country', label: 'Country', type: 'string' },
                { field: 'City', label: 'City', type: 'string' }
            ];

            const importRules = {
                'rules': [{
                    'label': 'FirstName',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'between',
                    'value': ['a', 'b']
                }]
            };
            const queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: importRules
            }, '#querybuilder');
            expect(queryBuilder.getSqlFromRules()).toEqual('FirstName BETWEEN a AND b');
        });
        it('954398 - Exception occurs when we clear the value on custom dropdown field in QueryBuilder component', (done) => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', ruleTemplate: '#template' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'City', label: 'City', type: 'string' }
            ];
            let valueObj: Slider;
            const rule: RuleModel = {
                'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 40
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                rule: rule,
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        const defaultNumber: number = 31;
                        const fieldObj: DropDownList = new DropDownList({
                            dataSource: customFieldData as any, // tslint:disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            showClearButton: true,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        const operatorObj: DropDownList = new DropDownList({
                            dataSource: [{key: 'equal', value: 'equal'}, {key:'between', value:'between'}, {key:'notbetween', value:'notbetween'}], // tslint:disable-line
                            fields: { text: 'key', value: 'value' },
                            value: args.rule.operator,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'operator');
                            }
                        });
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            cssClass: 'e-custom-ddl-value',
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                const elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        operatorObj.appendTo('#' + args.ruleID + '_operatorkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            setTimeout(() => {
                expect(queryBuilder.getSqlFromRules()).toEqual('EmployeeID = 40');
                const clearIcon: HTMLElement = queryBuilder.element.querySelector('.e-rule-filter .e-ddl .e-clear-icon');
                mouseEvent.initEvent('mousedown', true, true);
                if (clearIcon) {
                    clearIcon.dispatchEvent(mouseEvent);
                } else {
                    //const fieldElem: Element = queryBuilder.element.querySelector('.e-custom-ddl-value');
                    //queryBuilder.notifyChange(null, fieldElem, 'field');
                }
                //expect(queryBuilder.getSqlFromRules()).toEqual('');
                done();
            }, 100);
        });
        it('957276 - Issue with setRulesFromSql in QueryBuilder – Fails on Valid SQL Syntax Without Parentheses in LIKE Clause.', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData
            }, '#querybuilder');
            const actualSql: string = 'FirstName LIKE \'ewfew%\'';
            queryBuilder.setRulesFromSql(actualSql);
            queryBuilder.dataBind();
            expect(queryBuilder.element.querySelector('.e-rule-operator .e-dropdownlist').value).toEqual('Starts With');
        });
    });

    describe('Coverge Improvement', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });

        const rules: RuleModel = {
            'condition': 'and',
            'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1001
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            },
            {
                condition: 'or', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' }
                ]
            }
            ]
        };
        const columnData: ColumnsModel[] = [
            {
                field: 'EmployeeID', label: 'Employee ID', type: 'number'
            },
            { field: 'FirstName', label: 'First Name', type: 'string' },
            { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
            { field: 'Title', label: 'Title', type: 'string' },
            { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
            { field: 'Country', label: 'Country', type: 'string' },
            { field: 'City', label: 'City', type: 'string' }
        ];

        it('QueryBuilder with allowDragAndDrop dragstart', () => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-field .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder' , className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
        });
        it('QueryBuilder with allowDragAndDrop draghandler', () => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-field .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder' , className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.dragHandler({target: dragSpan, event: { clientY: 300}, dragElement: cloneElem });
            let ruleElem: Element[] = queryBuilder.element.querySelectorAll('.e-rule-container');
            let eventObj: any = { event: { clientY: 100} , target: ruleElem[1], dragElement: cloneElem };
            queryBuilder.dragHandler(eventObj);
            ruleElem = queryBuilder.element.querySelectorAll('.e-group-container');
            eventObj = { event: { clientY: 200} , target: ruleElem[0], dragElement: cloneElem };
            queryBuilder.dragHandler(eventObj);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    describe('Null or undefined Property testing', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });
        it('QueryBuilder with enableRtl', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];

            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableRtl: null,
                columns: customFieldData
            }, '#querybuilder');
            expect(queryBuilder.enableRtl).toEqual(false);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                enableRtl: undefined,
                columns: customFieldData
            }, '#querybuilder');
            expect(queryBuilder.enableRtl).toEqual(false);
        });

        it('QueryBuilder with columns', () => {
            queryBuilder = new QueryBuilder({
                columns: null
            }, '#querybuilder');
            expect(queryBuilder.columns).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: undefined
            }, '#querybuilder');
            expect(queryBuilder.columns).toEqual([]);
        });

        it('QueryBuilder with cssClass', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                cssClass: null
            }, '#querybuilder');
            expect(queryBuilder.cssClass).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                cssClass: undefined
            }, '#querybuilder');
            expect(queryBuilder.cssClass).toEqual('');
        });

        it('QueryBuilder with dataSource', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: null,
                columns: customFieldData
            }, '#querybuilder');
            expect(queryBuilder.dataSource).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: undefined,
                columns: customFieldData
            }, '#querybuilder');
            expect(queryBuilder.dataSource).toEqual([]);
        });

        it('QueryBuilder with displayMode', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                displayMode: null
            }, '#querybuilder');
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                displayMode: undefined
            }, '#querybuilder');
        });

        it('QueryBuilder with enableNotCondition', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                enableNotCondition: null
            }, '#querybuilder');
            expect(queryBuilder.enableNotCondition).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                enableNotCondition: undefined
            }, '#querybuilder');
            expect(queryBuilder.enableNotCondition).toEqual(false);
        });

        it('QueryBuilder with enablePersistence', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                enablePersistence: null
            }, '#querybuilder');
            expect(queryBuilder.enablePersistence).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                enablePersistence: undefined
            }, '#querybuilder');
            expect(queryBuilder.enablePersistence).toEqual(false);
        });

        it('QueryBuilder with fieldMode', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                fieldMode: null
            }, '#querybuilder');
            expect(queryBuilder.fieldMode).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                fieldMode: undefined
            }, '#querybuilder');
            expect(queryBuilder.fieldMode).toEqual('Default');
        });

        it('QueryBuilder with fieldModel', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                fieldModel: {
                    allowFiltering: null
                }
            }, '#querybuilder');
            expect(queryBuilder.fieldModel.allowFiltering).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                fieldModel: {
                    allowFiltering: undefined
                }
            }, '#querybuilder');
            expect(queryBuilder.fieldModel.allowFiltering).toEqual(undefined);
        });

        it('QueryBuilder with operatorModel', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                operatorModel: null
            }, '#querybuilder');
            expect(queryBuilder.operatorModel).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                operatorModel: undefined
            }, '#querybuilder');
            expect(queryBuilder.operatorModel).toEqual(null);
        });

        it('QueryBuilder with readonly', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                readonly: null
            }, '#querybuilder');
            expect(queryBuilder.readonly).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                operatorModel: undefined
            }, '#querybuilder');
            expect(queryBuilder.readonly).toEqual(false);
        });

        it('QueryBuilder with locale', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                locale: null
            }, '#querybuilder');
            expect(queryBuilder.locale).toEqual('en-US');
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                locale: undefined
            }, '#querybuilder');
            expect(queryBuilder.locale).toEqual('en-US');
        });

        it('QueryBuilder with width', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                width: null
            }, '#querybuilder');
            expect(queryBuilder.width).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                width: undefined
            }, '#querybuilder');
            expect(queryBuilder.width).toEqual('auto');
        });

        it('QueryBuilder with height', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                height: null
            }, '#querybuilder');
            expect(queryBuilder.height).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                height: undefined
            }, '#querybuilder');
            expect(queryBuilder.height).toEqual('auto');
        });

        it('QueryBuilder with immediateModeDelay', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                immediateModeDelay: null
            }, '#querybuilder');
            expect(queryBuilder.immediateModeDelay).toEqual(null);
            queryBuilder.destroy();
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                immediateModeDelay: undefined
            }, '#querybuilder');
            expect(queryBuilder.immediateModeDelay).toEqual(0);
        });

        it('QueryBuilder with separator', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                separator: null
            }, '#querybuilder');
            expect(queryBuilder.separator).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                separator: undefined
            }, '#querybuilder');
            expect(queryBuilder.separator).toEqual('');
        });

        it('QueryBuilder with summaryView', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                summaryView: null
            }, '#querybuilder');
            expect(queryBuilder.summaryView).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                summaryView: undefined
            }, '#querybuilder');
            expect(queryBuilder.summaryView).toEqual(false);
        });

        it('QueryBuilder with addRuleToNewGroups', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                addRuleToNewGroups: null
            }, '#querybuilder');
            expect(queryBuilder.addRuleToNewGroups).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                addRuleToNewGroups: undefined
            }, '#querybuilder');
            expect(queryBuilder.addRuleToNewGroups).toEqual(true);
        });

        it('QueryBuilder with showButtons', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                showButtons: { ruleDelete: null, groupInsert: null, groupDelete: null},
                rule: importRules
            }, '#querybuilder');
            expect(queryBuilder.showButtons.ruleDelete).toEqual(null);
            expect(queryBuilder.showButtons.groupInsert).toEqual(null);
            expect(queryBuilder.showButtons.groupDelete).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                showButtons: { ruleDelete: undefined, groupInsert: undefined, groupDelete: undefined}
            }, '#querybuilder');
            expect(queryBuilder.showButtons.ruleDelete).toEqual(true);
            expect(queryBuilder.showButtons.groupInsert).toEqual(true);
            expect(queryBuilder.showButtons.groupDelete).toEqual(true);
        });

        it('QueryBuilder with autoSelectOperator', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                autoSelectOperator: null
            }, '#querybuilder');
            expect(queryBuilder.autoSelectOperator).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                autoSelectOperator: undefined
            }, '#querybuilder');
            expect(queryBuilder.autoSelectOperator).toEqual(true);
        });

        it('QueryBuilder with sortDirection', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                sortDirection: null
            }, '#querybuilder');
            expect(queryBuilder.sortDirection).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                sortDirection: undefined
            }, '#querybuilder');
            expect(queryBuilder.sortDirection).toEqual('Default');
        });

        it('QueryBuilder with maxGroupCount', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                maxGroupCount: null
            }, '#querybuilder');
            expect(queryBuilder.maxGroupCount).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                maxGroupCount: undefined
            }, '#querybuilder');
            expect(queryBuilder.maxGroupCount).toEqual(5);
        });

        it('QueryBuilder with valueModel', () => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                valueModel: null
            }, '#querybuilder');
            expect(queryBuilder.valueModel).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: customFieldData,
                valueModel: undefined
            }, '#querybuilder');
            expect(queryBuilder.valueModel).toEqual(null);
        });

        it('QueryBuilder with enableSeparateConnector', () => {
            const empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [1, 2, 3, 4, 5]},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            const valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] }
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
                enableSeparateConnector: null
            }, '#querybuilder');
            expect(queryBuilder.enableSeparateConnector).toEqual(null);
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
                enableSeparateConnector: undefined
            }, '#querybuilder');
            expect(queryBuilder.enableSeparateConnector).toEqual(false);
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
                enableSeparateConnector: true
            }, '#querybuilder');
            expect(queryBuilder.enableSeparateConnector).toEqual(true);
        });

        // Add to Data Manager describe block
        it('Should parse comma-separated string values for "in" operator', (done: Function) => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData
            }, '#querybuilder');
            const fieldElem = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();

            const operatorElem: any = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[8].click();

            const valueInput = queryBuilder.element.querySelector('.e-rule-value input');
            // Simulate comma-separated input
            valueInput.value = 'val1, val2,  val3';
            valueInput.dispatchEvent(new Event('input'));

            const rule = queryBuilder.getValidRules().rules[0];
            expect(rule.value).toEqual(['val1', ' val2', '  val3']);
            done();
        });

        it('Should parse comma-separated numbers for "notin" operator', (done: Function) => {
            const customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            queryBuilder = new QueryBuilder({
                columns: customFieldData
            }, '#querybuilder');
            // Test with number field
            const fieldElem = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();

            const operatorElem: any = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[9].click();

            const valueInput = queryBuilder.element.querySelector('.e-rule-value input');
            valueInput.value = '1,2,3';
            valueInput.dispatchEvent(new Event('input'));

            const rule = queryBuilder.getValidRules().rules[0];
            expect(rule.value).toEqual([1, 2, 3]);
            done();
        });

    });


    describe('QueryBuilder Spinner', () => {
        let qb: any;
        let container: HTMLElement;

        beforeEach(() => {
            qb = new QueryBuilder({});
            container = document.createElement('div');
            document.body.appendChild(container);
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('should create and append spinner to the element', () => {
            qb.createSpinner(container);
            const spinnerElem = container.querySelector('.e-qb-spinner');

            expect(spinnerElem).not.toBeNull();
        });
    });

    describe('Get Sql From Rules and Set sql from rules', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
        });

        const rules: RuleModel = {
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
                    'value': 'Sales Manager'
                },
                {
                    'field': 'TitleOfCourtesy',
                    'label': 'Title Of Courtesy',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': 'Mr.'
                }]
            }, {
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
            }
            ]
        };
        it('QueryBuilder get and set sql methods', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                rule: rules,
                displayMode: 'Horizontal',
                allowValidation: true
            }, '#querybuilder');
            let actualSql: string = 'EmployeeID = 1 AND Title = \'Sales Manager\' AND (FirstName LIKE (\'ewfew%\') OR TitleOfCourtesy = \'Mr.\' OR (FirstName LIKE (\'ewfew%\') AND HireDate = \'12/06/2024\') OR (FirstName LIKE (\'reer%\') OR Title LIKE (\'erer%\'))) AND Title LIKE (\'ewfew%\')';
            queryBuilder.setRulesFromSql(actualSql);
            let expectedSql: string = queryBuilder.getSqlFromRules();
            expect(expectedSql).toEqual(actualSql);
            actualSql = 'EmployeeID = 1001 AND (Title LIKE (\'%Sales Manager%\') OR (City = \'Kirkland\' AND (FirstName LIKE (\'fewfew%\') OR FirstName LIKE (\'efew%\'))) OR LastName LIKE (\'erer%\')) AND (FirstName LIKE (\'ewfew%\') AND Title LIKE (\'efweew%\'))';
            queryBuilder.setRulesFromSql(actualSql);
            expectedSql = queryBuilder.getSqlFromRules();
            expect(expectedSql).toEqual(actualSql);
            actualSql = '(EmployeeID = 1 AND LastName LIKE (\'rgerger%\') AND (FirstName LIKE (\'erger%\') OR Title LIKE (\'asawd%\')) AND (Title LIKE (\'reger%\') AND FirstName LIKE (\'aefwaw%\')) AND (Title LIKE (\'ewrew%\') OR LastName LIKE (\'ewfew%\')))';
            queryBuilder.setRulesFromSql(actualSql);
            expectedSql = queryBuilder.getSqlFromRules();
            expect(expectedSql).toEqual(actualSql);
        });
    });

    describe('clone, lock group covergae improvement', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
        });
        const rules: RuleModel = {
            'condition': 'and',
            'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1001
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            },
            {
                condition: 'or', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' },
                    { 'label': 'HireDate',
                        'field': 'HireDate',
                        'type': 'date',
                        'operator': 'equal',
                        'value': '11/11/2024' },
                    { 'label': 'TitleOfCourtesy',
                        'field': 'TitleOfCourtesy',
                        'type': 'boolean',
                        'operator': 'equal',
                        'value': 'Mr' }
                ]
            }
            ]
        };
        const columnData: ColumnsModel[] = [
            {
                field: 'EmployeeID', label: 'Employee ID', type: 'number'
            },
            { field: 'FirstName', label: 'First Name', type: 'string' },
            { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
            { field: 'Title', label: 'Title', type: 'string' },
            { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
            { field: 'Country', label: 'Country', type: 'string' },
            { field: 'City', label: 'City', type: 'string' }
        ];
        it('QueryBuilder methods cloneGroup, lockGroup', () => {
            queryBuilder = new QueryBuilder({
                showButtons: { ruleDelete: true , groupInsert: true, groupDelete: true, cloneGroup: false, cloneRule: false},
                columns: columnData,
                rule: rules
            }, '#querybuilder');
            queryBuilder.cloneGroup('querybuilder_group0', 'querybuilder_group1', 1);
            queryBuilder.cloneRule('querybuilder_group0_rule0', 'querybuilder_group0', 1);
            queryBuilder.lockGroup('querybuilder_group0');
            queryBuilder.lockRule('querybuilder_group0_rule0');
        });
        it('QueryBuilder methods cloneGroup, lockGroup', () => {
            queryBuilder = new QueryBuilder({
                showButtons: { ruleDelete: true , groupInsert: true, groupDelete: true, cloneGroup: false, cloneRule: false},
                columns: columnData,
                rule: rules
            }, '#querybuilder');
            queryBuilder.lockGroup('querybuilder_group0');
            queryBuilder.lockGroup('querybuilder_group0');
        });
    });


    describe('Coverage Improvement', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });

        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });

        it('QueryBuilder with complex data binding filtering', (done) => {
            const columns: ColumnsModel[] = [
                {field: 'Employee', label: 'Employee', columns: [
                    { field: 'ID', label: 'ID', type: 'number'},
                    { field: 'DOB', label: 'Date of birth', type: 'date'},
                    { field: 'HireDate', label: 'Hire Date', type: 'date'},
                    { field: 'Salary', label: 'Salary', type: 'number'},
                    { field: 'Age', label: 'Age', type: 'number'},
                    { field: 'Title', label: 'Title', type: 'string'}
                ]},
                {field: 'Name', label: 'Name', columns: [
                    { field: 'FirstName', label: 'First Name', type: 'string'},
                    { field: 'LastName', label: 'Last Name', type: 'string'}
                ]},
                {field: 'Country', label: 'Country', columns : [
                    { field: 'State', label: 'State', columns : [
                        { field: 'City', label: 'City', type: 'string'},
                        { field: 'Zipcode', label: 'Zip Code', type: 'number'}] },
                    { field: 'Region', label: 'Region', type: 'string'},
                    { field: 'Name', label: 'Name', type: 'string'}
                ]}
            ];
            queryBuilder = new QueryBuilder({
                columns: columns,
                separator: '.',
                fieldMode: 'DropdownTree',
                allowValidation: true,
                fieldModel: { allowFiltering: true },
                // Add an initial rule to prevent null field error
                rule: {
                    condition: 'and',
                    rules: [{
                        label: 'First Name',
                        field: 'Name.FirstName',  // Set a valid initial field
                        type: 'string',
                        operator: 'equal',
                        value: ''
                    }]
                }
            }, '#querybuilder');
            setTimeout(() => {
                try {
                    queryBuilder.setRulesFromSql('Name.FirstName LIKE (\'Date.parse(\'yyyy-MM-dd\',\'1980-05-24\')%\')');
                    setTimeout(() => {
                        const filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control.e-dropdowntree');
                        if (filterElem && filterElem.ej2_instances && filterElem.ej2_instances[0]) {
                            const ddtFilter = filterElem.ej2_instances[0];
                            ddtFilter.showPopup();
                            setTimeout(() => {
                                let filterInp = document.querySelector('.e-qb-ddt .e-filter-wrap .e-textbox');
                                if (filterInp) {
                                    queryBuilder.dropdownTreeFiltering({
                                        cancel: false,
                                        text: 'em',
                                        event: {srcElement: filterInp}
                                    });
                                    filterInp = document.querySelector('.e-qb-ddt .e-filter-wrap .e-clear-icon');
                                    if (filterInp) {
                                        queryBuilder.dropdownTreeFiltering({
                                            cancel: false,
                                            text: '',
                                            event: {srcElement: filterInp}
                                        });
                                        if (ddtFilter.hidePopup) {
                                            ddtFilter.hidePopup();
                                        }
                                        queryBuilder.validateFields();
                                    }
                                }
                                done();
                            }, 100);
                        }
                    }, 100);
                } catch (e) {
                    console.error('Error in test:', e);
                    fail('Error occurred while executing test: ' + e.message);
                }
            }, 100);
        });
        it('QueryBuilder field name with space', () => {
            const columns: ColumnsModel[] = [
                { field: 'ID', label: 'ID', type: 'number'},
                { field: 'DOB', label: 'Date of birth', type: 'date'},
                { field: 'Hire Date', label: 'Hire Date', type: 'date'},
                { field: 'Salary', label: 'Salary', type: 'number'},
                { field: 'Age', label: 'Age', type: 'number'},
                { field: 'Title', label: 'Title', type: 'string'}
            ];
            queryBuilder = new QueryBuilder({ columns: columns }, '#querybuilder');
            queryBuilder.setRulesFromSql(' \'Hire Date\' = \'1980-05-24\'');
            const qStr = queryBuilder.getSqlFromRules(queryBuilder.getValidRules());
        });
    });

    describe('Coverage Improvement - number literal', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });
        const rules: RuleModel = {
            'condition': 'and',
            'rules': [{
                'label': 'EmployeeID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 10.01
            }
            ]
        };
        const numberLiteralData: object[] = [
            { field: '1001', label: '1001', type: 'number' },
            { field: '1002', label: '1002', type: 'string' },
            { field: 'EmployeeID', label: 'Employee ID', type: 'number' }
        ];
        it('QueryBuilder with number literal', () => {
            queryBuilder = new QueryBuilder({ columns: numberLiteralData, rule: rules }, '#querybuilder');
            const actualSql: string = 'EmployeeID = 10.01 AND EmployeeID = 10.023)';
            queryBuilder.setRulesFromSql(actualSql);
            (queryBuilder as any).parser = [{}, {}];
            (queryBuilder as any).checkNumberLiteral('10.01');
            let operator: string = (queryBuilder as any).getOperator('%sgsdg%', 'not like', true);
            operator = (queryBuilder as any).getOperator('%sgsdg%', 'like', true);
            operator = (queryBuilder as any).getOperator('%sgsdg', 'like', true);
            operator = (queryBuilder as any).getOperator('%sgsdg', 'not like', true);
            operator = (queryBuilder as any).getOperator('sgsdg%', 'like', true);
            operator = (queryBuilder as any).getOperator('sgsdg%', 'not like', true);
            operator = (queryBuilder as any).getOperator('sgsdg', 'equal', true);
            const field: string = queryBuilder.getLabelFromColumn('EmployeeID');
            (queryBuilder as any).parseSqlStrings('', true);
            (queryBuilder as any).lockRule('group0_rule0');
            (queryBuilder as any).isDateFunction('date');
        });
    });

    describe('Coverage Improvement', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });
        const rules: RuleModel = {
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
                    'value': 'Sales Manager'
                },
                {
                    'field': 'TitleOfCourtesy',
                    'label': 'Title Of Courtesy',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': 'Mr.'
                }]
            }, {
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
            }
            ]
        };
        it('QueryBuilder with allowDragAndDrop helper', () => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            let dragSpan: Element = queryBuilder.element.querySelector('.e-rule-field .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            queryBuilder.helper();
            dragSpan = queryBuilder.element.querySelector('.e-group-header .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            queryBuilder.helper();
            queryBuilder.isFieldChange = false; queryBuilder.isDestroy = false;
            queryBuilder.fieldClose('querybuilder_group0_rule0_filterkey');
            queryBuilder.element.querySelector('.e-cloneproperties').remove();
            queryBuilder.element.querySelector('.e-cloneproperties').remove();
        });
    });
    describe('drag stop covergae improvement - Drag and drop rule', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });

        const columnData: ColumnsModel[] = [
            {
                field: 'EmployeeID', label: 'Employee ID', type: 'number'
            },
            { field: 'FirstName', label: 'First Name', type: 'string' },
            { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
            { field: 'Title', label: 'Title', type: 'string' },
            { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
            { field: 'Country', label: 'Country', type: 'string' },
            { field: 'City', label: 'City', type: 'string' }
        ];

        const rules: RuleModel = {
            'condition': 'and',
            'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1001
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            },
            {
                condition: 'or', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' },
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Doctor' },
                    {
                        condition: 'and', rules: [
                            { 'label': 'Title',
                                'field': 'Title',
                                'type': 'string',
                                'operator': 'equal',
                                'value': 'Engineer' }
                        ]
                    }
                ]
            },
            {
                condition: 'and', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' }
                ]
            }
            ]
        };

        it('QueryBuilder with allowDragAndDrop dragStop', (done: Function) => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            let dragSpan: Element = queryBuilder.element.querySelector('.e-rule-field .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            dragSpan = queryBuilder.element.querySelectorAll('.e-rule-field')[1];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            remove(document.querySelector('#querybuilder_group0'));
            queryBuilder.reset();
            done();
        });

        it('QueryBuilder with allowDragAndDrop dragStop - Not condition', (done: Function) => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, enableNotCondition: true, columns: columnData, rule: rules }, '#querybuilder');
            let dragSpan: Element = queryBuilder.element.querySelector('.e-rule-field .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            dragSpan = queryBuilder.element.querySelectorAll('.e-rule-field')[1];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            remove(document.querySelector('#querybuilder_group0'));
            queryBuilder.reset();
            done();
        });

        it('QueryBuilder with allowDragAndDrop dragStop - enable separator', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            let dragSpan: Element = queryBuilder.element.querySelector('.e-rule-field .e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[1];
            dragSpan = queryBuilder.element.querySelectorAll('.e-rule-field')[1];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            remove(document.querySelector('#querybuilder_group0'));
            queryBuilder.reset();
            done();
        });
    });
    describe('drag stop covergae improvement - Drag and drop group', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });

        const columnData: ColumnsModel[] = [
            {
                field: 'EmployeeID', label: 'Employee ID', type: 'number'
            },
            { field: 'FirstName', label: 'First Name', type: 'string' },
            { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
            { field: 'Title', label: 'Title', type: 'string' },
            { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
            { field: 'Country', label: 'Country', type: 'string' },
            { field: 'City', label: 'City', type: 'string' }
        ];

        const singleRule: RuleModel = {
            'condition': 'and',
            'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1001
            },
            {
                condition: 'or', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' }
                ]
            }
            ]};
        const rules: RuleModel = {
            'condition': 'and',
            'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1001
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            },
            {
                condition: 'or', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' },
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'notstartswith',
                        'value': 'Doctor' },
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'notendswith',
                        'value': 'Doctor' },
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'notcontains',
                        'value': 'Doctor' },
                    {
                        condition: 'and', rules: [
                            { 'label': 'Title',
                                'field': 'Title',
                                'type': 'string',
                                'operator': 'equal',
                                'value': 'Engineer' }
                        ]
                    }
                ]
            },
            {
                condition: 'and', rules: [
                    { 'label': 'Title',
                        'field': 'Title',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'Engineer' }
                ]
            }
            ]
        };

        it('QueryBuilder with allowDragAndDrop dragStop - group', (done: Function) => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            const dragSpan: Element = document.querySelectorAll('.e-group-header')[2].querySelector('.e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });

        it('QueryBuilder with allowDragAndDrop dragStop - Not', (done: Function) => {
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, enableNotCondition: true, columns: columnData, rule: rules }, '#querybuilder');
            const dragSpan: Element = document.querySelectorAll('.e-group-header')[2].querySelector('.e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });

        it('QueryBuilder with allowDragAndDrop dragStop - group - enableSeparateConnector', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            const dragSpan: Element = document.querySelectorAll('.e-group-header')[2].querySelector('.e-drag-qb-rule');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });

        it('QueryBuilder coverage - code coverage', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: rules }, '#querybuilder');
            const date: Date = (queryBuilder as any).getDate('10:10:50');
            const isTime: boolean = (queryBuilder as any).isTime('10:10:50');
            const predicate: any = (queryBuilder as any).getPredicate((queryBuilder as any).getValidRules());
            queryBuilder.rule.isLocked = true; queryBuilder.rule.custom = { value: 'sgsdgsg'};
            const rule: any = queryBuilder.getRules();
            (queryBuilder as any).disableRuleCondition((queryBuilder as any).element.querySelectorAll('.e-group-container')[1]);
            done();
        });
        it('QueryBuilder coverage - improvements', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: singleRule }, '#querybuilder');
            const date: Date = (queryBuilder as any).getDate('10:10:50');
            const isTime: boolean = (queryBuilder as any).isTime('10:10:50');
            const predicate: any = (queryBuilder as any).getPredicate((queryBuilder as any).getValidRules());
            queryBuilder.rule.isLocked = true; queryBuilder.rule.custom = { value: 'sgsdgsg'};
            const rule: any = queryBuilder.getRules();
            (queryBuilder as any).disableRuleCondition((queryBuilder as any).element.querySelectorAll('.e-group-container')[1]);
            done();
        });
        it('QueryBuilder coverage - new group_1', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: singleRule }, '#querybuilder');
            const date: Date = (queryBuilder as any).getDate('10:10:50');
            const isTime: boolean = (queryBuilder as any).isTime('10:10:50');
            const predicate: any = (queryBuilder as any).getPredicate((queryBuilder as any).getValidRules());
            queryBuilder.rule.isLocked = true; queryBuilder.rule.custom = { value: 'sgsdgsg'};
            const rule: any = queryBuilder.getRules();
            (queryBuilder as any).disableRuleCondition((queryBuilder as any).element.querySelectorAll('.e-group-container')[1], null, true, true);
            done();
        });
        it('QueryBuilder coverage - new group_2', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: singleRule }, '#querybuilder');
            const date: Date = (queryBuilder as any).getDate('10:10:50');
            const isTime: boolean = (queryBuilder as any).isTime('10:10:50');
            const predicate: any = (queryBuilder as any).getPredicate((queryBuilder as any).getValidRules());
            queryBuilder.rule.isLocked = true; queryBuilder.rule.custom = { value: 'sgsdgsg'};
            const rule: any = queryBuilder.getRules();
            (queryBuilder as any).disableRuleCondition((queryBuilder as any).element.querySelectorAll('.e-group-container')[1], null, true, false);
            done();
        });
        it('QueryBuilder coverage - new group_3', (done: Function) => {
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: singleRule }, '#querybuilder');
            const date: Date = (queryBuilder as any).getDate('10:10:50');
            const isTime: boolean = (queryBuilder as any).isTime('10:10:50');
            const predicate: any = (queryBuilder as any).getPredicate((queryBuilder as any).getValidRules());
            queryBuilder.rule.isLocked = true; queryBuilder.rule.custom = { value: 'sgsdgsg'};
            const rule: any = queryBuilder.getRules();
            (queryBuilder as any).disableRuleCondition((queryBuilder as any).element.querySelectorAll('.e-group-container')[1], null, false, true);
            (queryBuilder as any).deleteGroup('group1');
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - grop drag and drop', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' },
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] }
                ]
            };
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-list');
            queryBuilder.draggable.currentStateTarget = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[1];
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[6];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[6];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - grop drag and drop to empty group', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' },
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] }
                ]
            };
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-list');
            queryBuilder.draggable.currentStateTarget = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[1];
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[5];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.element.querySelector('.e-removerule').click();
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[5];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - querybuilder as target', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-list');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop group- querybuilder as target', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-list');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });

        it('QueryBuilder with allowDragAndDrop dragStop - querybuilder as target', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    {condition: 'and', rules: [{}]},
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelectorAll('.e-rule-list')[1];
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.element.querySelector('.e-removerule').click();
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - group0 as target', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    {condition: 'and', rules: [{}]},
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-group-container');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.element.querySelector('.e-removerule').click();
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - header as target separate connector', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-add-group-btn');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.dragHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-add-group-btn');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragStartHandler(eventObj);
            (<any>queryBuilder).isDragEventPrevent = true;
            queryBuilder.dragHandler(eventObj);
            (<any>queryBuilder).isDragEventPrevent = true;
            queryBuilder.dragStopHandler(eventObj);
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - querybuilder as target separate connector', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    { condition: 'and', rules: [
                        { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' }
                    ] },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-rule-list');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.dragHandler(eventObj);
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[4];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - querybuilder as target separate connector', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    {condition: 'and', rules: [{}]},
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelectorAll('.e-rule-list')[1];
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            eventObj.event = { clientX: 100, clientY: 100, changedTouches:[{clientX: 100, clientY: 100 }]};
            queryBuilder.dragHandler(eventObj);
            queryBuilder.element.querySelector('.e-removerule').click();
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
        it('QueryBuilder with allowDragAndDrop dragStop - group0 as target separate connector', (done: Function) => {
            const dRules: RuleModel = {
                condition: 'and',
                rules: [
                    {condition: 'and', rules: [{}]},
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Engineer' },
                    { 'label': 'Title', 'field': 'Title', 'type': 'string', 'operator': 'equal', 'value': 'Developer' }
                ]
            };
            queryBuilder = new QueryBuilder({ enableSeparateConnector: true, allowDragAndDrop: true, columns: columnData, rule: dRules }, '#querybuilder');
            const dragSpan: Element = queryBuilder.element.querySelector('.e-group-container');
            queryBuilder.draggable.currentStateTarget = dragSpan;
            const cloneElem: Element = createElement('div', { id: 'querybuilder', className: 'e-cloneproperties e-draganddrop e-dragclone e-group-body' });
            queryBuilder.dragElement = cloneElem;
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            const eventObj: any = { target: dragSpan, dragElement: cloneElem };
            queryBuilder.dragStartHandler(eventObj);
            queryBuilder.element.querySelector('.e-removerule').click();
            queryBuilder.draggedRule = queryBuilder.element.querySelectorAll('.e-drag-qb-rule')[2];
            queryBuilder.dragStopHandler({ target: dragSpan, event: { clientX: 100 }, dragElement: cloneElem });
            done();
        });
    });
    describe('Customer bug #902507', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
                remove(queryBuilder.element);
            }
        });
        it('Initial rule condition is not updated when adding a rule', () => {
            const columns = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            const importRules: RuleModel = {
                condition: '',
                rules: []
            };
            queryBuilder = new QueryBuilder({
                columns: columns,
                rule: importRules,
                showButtons: {
                    cloneGroup: true,
                    cloneRule: true
                }
            });
            queryBuilder.appendTo('#querybuilder');
            const addBtn: HTMLElement = select('.e-add-btn', queryBuilder.element) as HTMLElement;
            addBtn.click();
            (selectAll('.e-dropdown-popup .e-item', document.body)[1] as HTMLElement).click();
            const rules = queryBuilder.getRules();
            expect(rules.condition).toEqual('and');
        });
    });
    describe('Data Manager', () => {
        const data: DataManager = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/orders',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        const valRule: RuleModel = {
            'condition': 'and',
            'rules': [
                { 'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'equal', 'value': 'BERGS' },
                { 'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'isnull', value: null }
            ]
        };
        const valRule1: RuleModel = {
            'condition': 'and',
            'rules': [
                { 'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'in', 'value': 'BERGS' }
            ]
        };
        const columns: ColumnsModel[] = [
            { field: 'EmployeeID', label: 'Employee ID', type: 'string' },
            { field: 'OrderID', label: 'Order ID', type: 'string' },
            { field: 'CustomerID', label: 'CustomerID', type: 'string' }
        ];

        function createQB(options: QueryBuilderModel, done: Function): QueryBuilder {
            const dataBound: EmitType<Object> = () => {
                setTimeout(function(){
                    done();
                }, 3000);
            };
            options.dataBound = dataBound;
            options.fieldMode = 'DropdownTree';
            options.rule = valRule1;
            const qb: QueryBuilder = new QueryBuilder(options);
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            qb.appendTo('#querybuilder');
            return qb;
        }
        beforeAll((done: Function) => {
            queryBuilder = createQB({
                dataSource: data,
                columns: columns,
                rule: valRule
            }, done);
        });
    });
    describe('Data Manager1', () => {
        const data: DataManager = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/orders',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        const valRule: RuleModel = {
            'condition': 'and',
            'rules': [
                { 'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'equal', 'value': 'BERGS' },
                { 'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'isnull', value: null }
            ]
        };
        const valRule1: RuleModel = {
            'condition': 'and',
            'rules': [
                { 'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'in', 'value': 'BERGS' }
            ]
        };
        const columns: ColumnsModel[] = [
            { field: 'EmployeeID', label: 'Employee ID', type: 'string' },
            { field: 'OrderID', label: 'Order ID', type: 'string' },
            { field: 'CustomerID', label: 'CustomerID', type: 'string' }
        ];

        function createQB(options: QueryBuilderModel, done: Function): QueryBuilder {
            const dataBound: EmitType<Object> = () => {
                setTimeout(function(){
                    done();
                }, 3000);
            };
            options.dataBound = dataBound;
            options.rule = valRule1;
            const qb: QueryBuilder = new QueryBuilder(options);
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            qb.appendTo('#querybuilder');
            return qb;
        }
        beforeAll((done: Function) => {
            queryBuilder = createQB({
                dataSource: data,
                columns: columns,
                rule: valRule
            }, done);
        });
    });

    describe('DropdownTree Data Manager', () => {
        const SERVICE_URI = 'https://services.syncfusion.com/js/production/api/UrlDataSource';
        let queryBuilder: QueryBuilder;
        const data = new DataManager({
            url: SERVICE_URI,
            adaptor: new UrlAdaptor()
        });
        const columnData = [
            { field: 'EmployeeID', label: 'EmployeeID', type: 'number' },
            { field: 'FirstName', label: 'FirstName', type: 'string' },
            { field: 'Location', label: 'Location', type: 'string' },
            { field: 'Address', label: 'Address', type: 'string' }
        ];
        const importRules: RuleModel = {
            condition: 'and',
            rules: [{
                label: 'EmployeeID',
                field: 'EmployeeID',
                type: 'number',
                operator: 'in'
            }]
        };
        function createQB(options: QueryBuilderModel, done: Function): QueryBuilder {
            const dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    done();
                }, 1000);
            };
            options.dataBound = dataBound;
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            const qb = new QueryBuilder(options);
            qb.appendTo('#querybuilder');
            return qb;
        }
        beforeAll((done: Function) => {
            queryBuilder = createQB({
                dataSource: data,
                separator: '.',
                width: '100%',
                columns: columnData,
                rule: importRules,
                fieldMode: 'DropdownTree'
            }, done);
        });
    });

    describe('EJ2-771577 - Default JS sample verification', () => {
        const columnData = [
            { field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [20, 30], value: 10 },
            { field: 'FirstName', label: 'First Name', type: 'string', value: 'Syncfusion', values: ['10/01/2025', '10/31/2025'] },
            { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
            { field: 'HireDate', label: 'Hire Date', type: 'date', values: ['10/10/2025', '31/10/2025'], format: 'dd/MM/yyyy', value: '15/10/2025' }
        ];
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });

        afterEach(() => {
            if (queryBuilder) {
                queryBuilder.destroy();
            }
            remove(document.getElementById('querybuilder'));
        });

        it('Verify HireDate value binding from column definition', () => {
            const dateRules: RuleModel = {
                'condition': 'Equal',
                'rules': [{
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'equal',
                    'value': '15/10/2025'
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRules
            }, '#querybuilder');
            expect(queryBuilder.rule.rules.length).toBe(1);
            const actualHireDateRule = queryBuilder.rule.rules.find((r: any) => r.field === 'HireDate');
            expect(actualHireDateRule.value).toBe('15/10/2025');
        });
        it('Verify HireDate values with between operation from column definitions of DatePickers', () => {
            const dateRules: RuleModel = {
                'condition': 'Between',
                'rules': [{
                    'label': 'Hire Date',
                    'field': 'HireDate',
                    'type': 'date',
                    'operator': 'between',
                    'value': ['10/10/2025', '31/10/2025']
                }]
            };
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRules
            }, '#querybuilder');
            expect(queryBuilder.rule.rules.length).toBe(1);
            expect(queryBuilder.rule.rules[0].value[0]).toBe('10/10/2025');
            expect(queryBuilder.rule.rules[0].value[1]).toBe('31/10/2025');
            const dtObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            dtObj[0].value = new Date('11/02/2025');
            dtObj[0].dataBind();
            queryBuilder.refresh();
            expect(queryBuilder.rule.rules[0].value[0]).toEqual('02/11/2025');
        });
    });
    describe('MultiSelect DataManager coverage', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            if (queryBuilder) { queryBuilder.destroy(); }
            remove(document.getElementById('querybuilder'));
        });

        it('multiSelectOpen cancels default open and binds data (Default fieldMode)', (done: Function) => {
            const localData = [
                { OrderID: 10248 }, { OrderID: 10249 }, { OrderID: 10250 }, { OrderID: 10251 }
            ];
            const dm = new DataManager(localData);
            const cols: ColumnsModel[] = [
                { field: 'OrderID', label: 'OrderID', type: 'number' }
            ];
            const rules: RuleModel = {
                condition: 'and',
                rules: [{ field: 'OrderID', label: 'OrderID', type: 'number', operator: 'in', value: [10248] }]
            };
            const msQuery: Query = new Query().select(['OrderID']).take(3);
            const valueModel = { multiSelectModel: { query: msQuery } } as any;

            queryBuilder = new QueryBuilder({ dataSource: dm, columns: cols, rule: rules, valueModel }, '#querybuilder');

            setTimeout(() => {
                let valueElem = document.getElementById('querybuilder_group0_rule0_valuekey0') as HTMLElement;
                if (!valueElem) {
                    const msElem = queryBuilder.element.querySelector('.e-rule-value .e-multiselect') as HTMLElement;
                    if (msElem) { valueElem = msElem; }
                }
                expect(valueElem).toBeTruthy();
                const args: any = { cancel: false };
                (queryBuilder as any).multiSelectOpen('querybuilder_group0_rule0_valuekey0', args);
                expect(args.cancel).toBe(false);
                setTimeout(() => {
                    const ms = getComponent(valueElem, 'multiselect') as MultiSelect;
                    expect(ms).toBeTruthy();
                    expect((ms as any).dataSource && (ms as any).dataSource.length > 0).toBe(true);
                    done();
                }, 100);
            }, 50);
        });
    });
});
