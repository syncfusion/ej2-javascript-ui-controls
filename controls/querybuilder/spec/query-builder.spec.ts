/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, ColumnsModel,  RuleModel, QueryBuilderModel, FormatObject } from '../src/query-builder/index';
import { createElement, remove, closest, select, selectAll, detach, getComponent, Internationalization, EmitType, EventHandler } from '@syncfusion/ej2-base';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
import { DatePicker, DateRangePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { profile , inMB, getMemoryProfile } from './common.spec';
import { DataManager, ODataAdaptor } from '@syncfusion/ej2-data';

MultiSelect.Inject(CheckBoxSelection);

/**
 * @param  {} 'Button'
 * @param  {} function(
 */

let intl = new Internationalization();
let clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);

describe('QueryBuilder', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    let queryBuilder: any;
    let complexBindingData: Object[] = [{
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
                'Zipcode': 22434,
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

    let complexData: object[] = [{
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
            'Country': 'USA',
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
            'Country': 'USA',
        }
      }
    ];

    let employeeData: Object[] = [{
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
    let mouseEvent: MouseEvent = document.createEvent('MouseEvents');
    let mouseEvent2: MouseEvent = document.createEvent('MouseEvents');

    let columnData: ColumnsModel[] = [
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

    let importRules: RuleModel = {
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
    let columnData1: ColumnsModel[] = [
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
    let dateFormatData: ColumnsModel[] = [
        { field: 'TaskID', label: 'Task ID', type: 'number' },
        { field: 'Name', label: 'Name', type: 'string' },
        { field: 'Date', label: 'Date', type: 'date', format: 'dd/MM/yyyy', operators: [{key: 'equal', value: 'equal'}, {key: 'notequal', value: 'notequal'}] }
    ];
    let eData: ColumnsModel[] = [
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
    let fieldData: ColumnsModel[] = [
        { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
        { field: 'FirstName', label: 'First Name', type: 'string' },
        { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
        { field: 'Title', label: 'Title', type: 'string' },
        { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
        { field: 'Country', label: 'Country', type: 'string' },
        { field: 'City', label: 'City', type: 'string' }
    ];
    let buttonData: ColumnsModel[] = [
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
    let filter: ColumnsModel[] = [
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
                    let ds: string[] = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallet'];
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
            ],
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
                { key: 'Not Equal', value: 'notequal' }],
        },
        { field: 'Description', label: 'Description', type: 'string' },
        { field: 'Date', label: 'Date', type: 'date', template: {
                create: () => {
                    var parentElem = [];
                    parentElem.push(document.createElement("input"));
                    parentElem.push(document.createElement("input"));
                    return parentElem;
                },
                destroy: (args: {elements: NodeListOf<Element>}) => {
                    for (let i = 0, len = args.elements.length; i < len; i++) {
                        let date: TimePicker = getComponent(args.elements[i] as HTMLElement, "timepicker") as TimePicker;
                        if (date) {
                          date.destroy();
                        }
                    }
                },
                write: (args: {elements: Element, values: string, operator: string}) => {
                    let format = { type: "dateTime", skeleton: "hm" };
                    if (args.operator.indexOf("between") > -1) {
                        let dateArr: any = args.values ? args.values : [];
                        let dateRangeObj1 = new TimePicker({
                            placeholder: "Select Time",
                            min: new Date("3/8/2017 0:00 AM"),
                            max: new Date("3/8/2017 2:00 AM"),
                            change: e => {
                                dateArr[0] = e.value ? intl.formatDate(e.value, format) : null;
                                queryBuilder.notifyChange(dateArr, e.element);
                            }
                        });
                        let dateRangeObj2 = new TimePicker({
                            placeholder: "Select Time",
                            min: new Date("3/8/2017 0:00 AM"),
                            max: new Date("3/8/2017 2:00 AM"),
                            change: e => {
                                dateArr[1] = e.value ? intl.formatDate(e.value, format) : null;
                                queryBuilder.notifyChange(dateArr, e.element);
                            }
                        });
                        dateRangeObj1.appendTo("#" + args.elements[0].id);
                        dateRangeObj2.appendTo("#" + args.elements[1].id);
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
                    let slider: Slider = new Slider({
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
            ],
        }
    ];
    let tempRules: RuleModel = {
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

    let importRules1: RuleModel = {
        'condition': 'or',
        'rules': [{
            'label': 'Category',
            'field': 'Category',
            'type': 'string',
            'operator': 'endswith',
            'value': 'Laptop'
        }]
    };
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
    let dateRules: RuleModel = {
        'condition': 'or',
        'rules': [{
            'label': 'DOB',
            'field': 'DOB',
            'type': 'date',
            'operator': 'equal',
            'value': '12/12/2001'
        }]
    };
    let eRules: RuleModel = {
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

    let fieldRules: RuleModel = {
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

    let operatorRules: RuleModel = {
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


    let dataRules: RuleModel = {
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
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            // queryBuilder = null;
            queryBuilder.destroy();
        });
        it('Default testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-query-builder')).toBeTruthy();
            expect(queryBuilder.element.firstElementChild.classList.contains('e-group-container')).toBeTruthy();
            let childContent: Element = queryBuilder.element.firstElementChild.children[0];
            expect(childContent.classList.contains('e-group-header')).toBeTruthy();
            expect(childContent.children[0].classList.contains('e-btn-group')).toBeTruthy();
            expect(childContent.children[1].classList.contains('e-group-action')).toBeTruthy();
            childContent = queryBuilder.element.firstElementChild.children[1];
            expect(childContent.classList.contains('e-group-body')).toBeTruthy();
            expect(childContent.firstElementChild.classList.contains('e-rule-list')).toBeTruthy();
            expect(childContent.firstElementChild.children[0].classList.contains('e-rule-container')).toBeTruthy();
        });

        it('Add Group / condition testing', () => {
            queryBuilder = new QueryBuilder({
                showButtons: { groupDelete: true, groupInsert: true, ruleDelete: true },
                columns: columnData
            }, '#querybuilder');
            expect(queryBuilder.element.firstElementChild.classList.contains('e-group-container')).toBeTruthy();
            let childContent: Element = queryBuilder.element.firstElementChild.children[0];
            expect(childContent.classList.contains('e-group-header')).toBeTruthy();
            let addBtn: HTMLElement = select('.e-add-btn', childContent) as HTMLElement;
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
        it('displayMode testing Vertical', () => {
            expect(queryBuilder.displayMode).toEqual('Horizontal');
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
            expect(queryBuilder.displayMode).toEqual('Horizontal');
            let ruleElem: HTMLElement = queryBuilder.element.querySelector('.e-rule-container');
            expect(ruleElem.classList.contains('e-horizontal-mode')).toBeTruthy();
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
                enableRtl: true,
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-rtl')).toBeTruthy();
        });

        it('disable RTL testing', () => {
            queryBuilder = new QueryBuilder({
                enableRtl: false,
            }, '#querybuilder');
            expect(queryBuilder.element.classList.contains('e-rtl')).toBeFalsy();
        });
        it('enable summaryView testing', () => {
            queryBuilder = new QueryBuilder({
                summaryView: false,
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
                summaryView: true,
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('block');
            queryBuilder = new QueryBuilder({
                summaryView: true
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-summary-content').style.display).toEqual('block');
        });
        it('enable/disable summaryView testing', () => {
            queryBuilder = new QueryBuilder({
                summaryView: true,
            }, '#querybuilder');
            queryBuilder.element.querySelector('.e-collapse-rule').click();
        });
        it('disable summaryView testing', () => {
            let dataColl: object[] = [
                {'Name': 'A', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'},
                {'Name': 'B', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'},
                {'Name': 'C', 'Designation': 'Software', 'DOB': '1/1/2018', 'DOJ': '1/1/2021'}
            ];
            let columnDataColl: ColumnsModel[] = [
                { field: 'Name', label: 'Name', type: 'string' },
                { field: 'Designation', label: 'Designation', type: 'string' },
                { field: 'DOB', label: 'DOB', type: 'date', category:'Date' },
                { field: 'DOJ', label: 'DOJ', type: 'date', category:'Date' },
            ];
            queryBuilder = new QueryBuilder({
                dataSource: dataColl,
                summaryView: false,
                columns: columnDataColl
            }, '#querybuilder');
            expect(queryBuilder.element.querySelectorAll('.e-collapse-rule').length).toBe(0);
            queryBuilder.addRules([{ 'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['Nancy'] }], 'group0');
            let multiObj: MultiSelect = queryBuilder.element.querySelector('.e-control.e-multiselect').ej2_instances;
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
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
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
            mouseEvent.initEvent("mousedown", true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent("mouseup", true, true);
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
            mouseEvent.initEvent("mousedown", true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent("mouseup", true, true);
            ele.dispatchEvent(mouseEvent2);
            expect(valueElem[0].value).toEqual(1);
            expect(queryBuilder.rule.rules[0].value[0]).toEqual(1);

            valueElem = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[1].ej2_instances;
            ele = valueElem[0].spinUp;
            mouseEvent.initEvent("mousedown", true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent("mouseup", true, true);
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
            remove(queryBuilder.element.nextElementSibling);
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
            expect(document.getElementsByClassName('e-summary-content')[0].querySelector('textarea').value).toEqual("EmployeeID = 1 OR Title = 'Sales Manager'");
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
           let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
           operatorElem[0].showPopup();
           itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
           itemsCln[5].click();
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
          let msObj: MultiSelect = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
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
    });
    describe('Public Methods', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
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
            queryBuilder = new QueryBuilder({
                columns: columnData2,
                rule: sqlRules,
                enableNotCondition: true
            }, '#querybuilder');
            let fieldElem: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            var itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[6].click();
            expect(queryBuilder.getSqlFromRules()).toContain('Date');
            queryBuilder.setRules(sqlRules);
            expect(queryBuilder.getSqlFromRules()).toEqual("NOT (Category LIKE ('%Laptop') OR Category LIKE ('%Lap%'))");
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(2);
            queryBuilder.setRules(sqlMultipleRules);
            let sqlString: string = "NOT (Category LIKE ('%Laptop') OR Category LIKE ('%Lap%') OR ( NOT (Category LIKE ('%Laptop') OR Category LIKE ('%Lap%'))))";
            expect(queryBuilder.getSqlFromRules()).toEqual(sqlString);
            queryBuilder.setRules(simpleRule);
            expect(queryBuilder.getSqlFromRules(simpleRule, true)).toEqual("`Category` LIKE ('%Laptop')");
            queryBuilder.setRules(simpleRule1);
            expect(queryBuilder.getSqlFromRules(simpleRule1, true)).toEqual("`Category` IS NULL");
            queryBuilder.setRules(simpleRule2);
            expect(queryBuilder.getSqlFromRules(simpleRule2)).toEqual("Category IN ('a','b') OR TaskID IN (1,2)");
            queryBuilder.setRules(simpleRule3);
            let sql: string = queryBuilder.getSqlFromRules(queryBuilder.rule);
            queryBuilder.setRulesFromSql(sql);
        });

        it('setRules from sql rule testing', () => {
            queryBuilder = new QueryBuilder({
                columns: boolData,
                enableNotCondition: true
            }, '#querybuilder');
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category LIKE ('%Laptop')"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Status = true"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category = null"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("TaskID = -10"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql('Category = "Nancy"'));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category LIKE ('%Nancy%')"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category IS NULL"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("TaskID IN (1, 2)"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category IN ('a', 'b')"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category LIKE ('')"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category NOT LIKE ('')"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category LIKE ('%Laptop') AND (NOT (Category LIKE ('%L')))"));
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Date BETWEEN '1/6/2020' AND '1/8/2020'"));
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category LIKE ('%Laptop') AND (NOT (Category IS NULL)"));
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
            let rule: RuleModel = {
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
            let rules: RuleModel = queryBuilder.getRules();
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
          let textBoxObj: TextBox = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
          textBoxObj[0].element.dispatchEvent(new Event('focus'));
          textBoxObj[0].element.dispatchEvent(new KeyboardEvent('keypress', {'key': 'c'}));
          textBoxObj[0].dataBind();
          queryBuilder.updateRules(textBoxObj[0].element, 'US', 0);
          expect(textBoxObj[0].element.parentElement.classList.contains('e-tooltip')).toBeFalsy();
          expect(document.getElementsByClassName('e-querybuilder-error').length).toBe(0);
        });
        it('Date Value changes', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                rule: dateRules,
            }, '#querybuilder');
            let cObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances;
            cObj[0].value = new Date('02/10/2021');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('2/10/2021');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].value.toDateString()).toEqual('Wed Feb 10 2021');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'notequal', 'value': '2/10/2021'}], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].value.toDateString()).toEqual('Wed Feb 10 2021');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{ 'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'greaterthan', 'value': '2/10/2021' }], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Thu Feb 11 2021');
            queryBuilder.element.querySelector('.e-rule-delete').click();
            queryBuilder.addRules([{ 'label': 'DOB', 'field': 'DOB', 'type': 'date', 'operator': 'lessthanorequal', 'value': '2/10/2021' }], 'group0');
            expect(queryBuilder.getPredicate(queryBuilder.rule).value.toDateString()).toEqual('Thu Feb 11 2021');
            let datePObj: DatePicker = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].ej2_instances;
            datePObj[0].show();
            (<HTMLElement>document.querySelectorAll('.e-datepicker.e-popup .e-cell')[5]).click();
        });

        it(' Radio Button Checking', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: fieldData,
                rule: fieldRules
            }, '#querybuilder');
           
            // Field change
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
            expect(filterElem[0].value).toEqual('TitleOfCourtesy');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('boolean');
    
             //operator change
             let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
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
            expect(queryBuilder.getSqlFromRules(queryBuilder.rule)).toEqual("EmployeeID BETWEEN 4 AND 5 AND Title IN ('Sales Manager') AND City LIKE ('u%')");
            queryBuilder.getRulesFromSql("EmployeeID BETWEEN 4 AND 5 and Title IN ('Sales Manager') and City LIKE ('u%')");
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[5].click();
            expect(operatorElem[0].value).toEqual('notbetween');
            operatorElem  = queryBuilder.element.querySelectorAll('.e-rule-operator .e-control')[1].ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule1_operatorkey_options').querySelectorAll('li');
            itemsCln[6].click();
            expect(operatorElem[0].value).toEqual('notin');
            queryBuilder.getFilteredRecords(queryBuilder.rule);
            expect(queryBuilder.getSqlFromRules(queryBuilder.rule)).toEqual("EmployeeID NOT BETWEEN 0 AND 0 AND Title NOT IN ('Sales Manager') AND City LIKE ('u%')");
            queryBuilder.reset();
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(0);
            queryBuilder.setRulesFromSql("EmployeeID BETWEEN 0 AND 0 and Title IN ('Sales Manager') and City LIKE ('u%')");
            queryBuilder.getRulesFromSql("Category = 'Clothing' and (Description LIKE ('%s') or PaymentMode = 'Debit Card') and Amount > 84");
            expect(JSON.stringify(queryBuilder.getRulesFromSql("Category = 'Clothing' and (Description LIKE ('%s') or PaymentMode = 'Debit Card') and Amount > 84").rules)).toEqual('[{"label":"Category","field":"Category","operator":"equal","type":"string","value":"Clothing"},{"condition":"or","rules":[{"label":"Description","field":"Description","operator":"endswith","type":"string","value":"s"},{"label":"PaymentMode","field":"PaymentMode","operator":"equal","type":"string","value":"Debit Card"}]},{"label":"Amount","field":"Amount","operator":"greaterthan","type":"number","value":84}]');
        });
        it(' Multiple value in textbox  Checking', () => {
            let valRule: RuleModel = {'condition': 'and',
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
            let operators: { [key: string]: Object }[] = [
                {value: 'equal', key: 'Equal', sqlOperator: '='},
                {value: 'notequal', key: 'Not Equal', sqlOperator: '<>'}
            ];
            let customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string', operators: operators }
            ];
            let valRule: RuleModel = {'condition': 'and',
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
            expect(queryBuilder.getSqlFromRules(valRule)).toEqual("FirstName <> 'Nancy'");
        });
        it('Not Condition Checking', () => {
            let valRule: RuleModel = {
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
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'notequal', 'value': 'Nancy'},
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1 },
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1, 2] },
                    {'condition':'or', 'not': false, rules: [
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
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-btngroup-or-lbl').classList.contains('e-readonly')).toBeTruthy();
            queryBuilder.readonly = false;
            queryBuilder.dataBind();
            queryBuilder.readonly = true;
            queryBuilder.dataBind();
            let inputObj: any = queryBuilder.element.querySelector('.e-filter-input');
            let keyEvent: any = document.createEvent('KeyboardEvents');
            keyEvent.initKeyboardEvent("keydown", true, true, null, false, false, false, false, 40, 40);
            Object.defineProperties(keyEvent, { keyCode: {value: 40} });
            inputObj.dispatchEvent(keyEvent);
        });
        it('Value Checking', () => {
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'in', 'value': [1] },
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: boolData,
                rule: valRule,
            }, '#querybuilder');
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control.e-input').classList.contains('e-textbox')).toBeTruthy();
            let inputObj: any = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances[0];
            inputObj.element.value = "10";
            let keyEvent = document.createEvent('KeyboardEvents');
            Object.defineProperty(keyEvent, 'target', {writable: false, value: inputObj.element});
            inputObj.inputHandler(keyEvent);
            queryBuilder.immediateModeDelay = true;
            queryBuilder.dataBind();
            queryBuilder.addRules([{ 'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['Nancy'] }], 'group0');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control.e-input')[1].classList.contains('e-textbox')).toBeTruthy();
            inputObj = queryBuilder.element.querySelectorAll('.e-rule-value input.e-control')[1].ej2_instances[0];
            inputObj.element.value = "Software";
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
            let empData: Object[] = [
                {'EmployeeID': '1', 'Name': 'A'},
                {'EmployeeID': '2', 'Name': 'B'},
                {'EmployeeID': '3', 'Name': 'C'},
                {'EmployeeID': '4', 'Name': 'D'},
                {'EmployeeID': '5', 'Name': 'E'}
            ];
            let empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': ['1'] },
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: empData,
                columns: empField,
                rule: valRule,
            }, '#querybuilder');
            let listObj: any = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances[0];
            (<any>listObj).inputElement.focus();
            listObj.showPopup();
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_valuekey0_popup').querySelectorAll('li');
                items[1].click();
                document.getElementById('querybuilder').click();
                expect(queryBuilder.rule.rules[0].value[0]).toEqual(1);
            }
            listObj.hidePopup();
            done();
        });
        it('Operator Checking', () => {
            let empData: Object[] = [
                {'EmployeeID': '1', 'Name': 'A'},
                {'EmployeeID': '2', 'Name': 'B'},
                {'EmployeeID': '3', 'Name': 'C'},
                {'EmployeeID': '4', 'Name': 'D'},
                {'EmployeeID': '5', 'Name': 'E'}
            ];
            let empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': ['1'] },
                ]
            };
            queryBuilder = new QueryBuilder({
                dataSource: empData,
                columns: empField,
                rule: valRule,
            }, '#querybuilder');
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[1].click(); 
        });
        it('Multiselect without datasource Checking', () => {
            let empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', values: [1, 2, 3, 4, 5]},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            let valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'EmployeeID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [1] },
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
            }, '#querybuilder');
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[1].click(); 
        });
        it('In operator with textbox Checking', () => {
            let empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'}
            ];
            let valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['A', 'B'] },
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
            }, '#querybuilder');
            let inputObj: any = queryBuilder.element.querySelectorAll('.e-rule-value input.e-control')[0].ej2_instances[0];
            inputObj.element.value = "A, B, C";
            let keyEvent = document.createEvent('KeyboardEvents');
            Object.defineProperty(keyEvent, 'target', {writable: false, value: inputObj.element});
            inputObj.inputHandler(keyEvent);
        });
        it('Date value Checking', () => {
            let empField: ColumnsModel[] = [
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'Name', label: 'Name', type: 'string'},
                {field: 'Date', label: 'Date', type: 'date'}
            ];
            let arrRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': ['12/2/2021', '12/3/2021'] }
                ]
            }
            let arrRule1: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': '12/2/2021' }
                ]
            }
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'equal', 'value': '12/2/2021' },
                ]
            };
            let betweenRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Date', 'field': 'Date', 'type': 'date', 'operator': 'between', 'value': '12/2/2021' },
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: empField,
                rule: valRule,
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
            let inputObj: DatePicker = queryBuilder.element.querySelector('.e-rule-value .e-control').ej2_instances;
            inputObj[0].value = new Date();
            inputObj[0].dataBind();
        });
        it('Date with Format Checking', () => {
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'isnull', 'value': null },
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: dateFormatData,
                rule: valRule,
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
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'Task ID', 'field': 'TaskID', 'type': 'number', 'operator': 'isnull', 'value': null },
                ]
            };
            queryBuilder = new QueryBuilder({
                columns: boolData,
                rule: valRule,
            }, '#querybuilder');
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('isnull');
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[11].click();
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('notnull');
            queryBuilder.element.querySelector('.e-removerule').click();
            queryBuilder.addRules([{ 'label': 'Name', 'field': 'Name', 'type': 'string', 'operator': 'in', 'value': ['Nancy'] }], 'group0');
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln= document.getElementById('querybuilder_group0_rule1_operatorkey_options').querySelectorAll('li');
            itemsCln[7].click();
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('equal');
            operatorElem[0].showPopup();
            itemsCln= document.getElementById('querybuilder_group0_rule1_operatorkey_options').querySelectorAll('li');
            itemsCln[8].click();
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('notequal');
            queryBuilder.setRulesFromSql("Date BETWEEN '1/12/2021' AND '2/12/2021'");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql("Date NOT BETWEEN '1/12/2021' AND '2/12/2021'");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('lessthan');
            queryBuilder.setRulesFromSql("Category IN('S', 'R')");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('equal');
            queryBuilder.setRulesFromSql("Category NOT IN('S', 'R')");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('notequal');
            queryBuilder.setRulesFromSql("Date BETWEEN '1/12/2021' AND '2/12/2021' OR Date = '1/12/2021'");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('greaterthanorequal');  
            queryBuilder.setRulesFromSql("Category IN('S', 'R') OR Category IN('S', 'R')");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('equal');
            queryBuilder.setRulesFromSql("Date = '1/12/2021' AND Date = '3/12/2021'");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql("Date = '1/12/2021' OR Date = '3/12/2021'");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].predicates[0].operator).toEqual('greaterthanorequal');
            queryBuilder.setRulesFromSql("TaskID IN (4,5) OR (Category LIKE ('ALFKI%'))");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[1].operator).toEqual('startswith');
            queryBuilder.setRulesFromSql("(Category LIKE ('ALFKI%')) OR (TaskID = 0)");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('startswith');
            queryBuilder.setRulesFromSql("(Date = null)");
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('equal');
            queryBuilder.setRulesFromSql("Categroy NOT LIKE ('%ALFKI%') OR Categroy NOT LIKE ('%ALFKI%')");
            expect(queryBuilder.getPredicate(queryBuilder.rule)).toEqual(undefined);
            queryBuilder.setRulesFromSql("Category LIKE ('ALFKI%') OR TaskID = 0");
            expect(queryBuilder.getPredicate(queryBuilder.rule).predicates[0].operator).toEqual('startswith');
            queryBuilder.setRulesFromSql("() AND Category LIKE ('sda%')");
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('startswith');
            queryBuilder.setRulesFromSql("() OR Category LIKE ('sda%')");
            expect(queryBuilder.getPredicate(queryBuilder.rule).operator).toEqual('startswith');
        });
        it('Default Value Checking', () => {
            let formatObj: FormatObject = {skeleton: 'yMd'}
            let valRule: RuleModel = {
                'condition': 'and',
                'not': true,
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'in', 'value': ['Nancy']},
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'in', 'value': [5] },
                    {'label': 'Employee ID', 'field': 'EmployeeID', 'type': 'number', 'operator': 'equal', 'value': 1 }
                ] 
            };
            let filterColl: ColumnsModel[] = [
                {field: 'FirstName', label: 'First Name', type: 'string', value: 'Nancy'},
                {field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 1},
                {field: 'LastName', label: 'Last Name', type: 'string', value: ['Davolio']},
                {field: 'BirthDate', label: 'BirthDate', type:'date', format:'short', value: '02/17/2021'},
                {field: 'HireDate', label: 'HireDate', type:'date', format: formatObj, value: new Date(704692800000)},
                {field: 'Status', label: 'Status', type:'boolean', value: true},
                {field: 'ValueStatus', label: 'ValueStatus', type:'boolean', value: 'true', values: ['true', 'false']},
                {field: 'FalseStatus', label: 'FalseStatus', type:'boolean', value: false}
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
            let valRule: RuleModel = {
                'condition': 'and',
                'rules': [
                    {'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'isempty', 'value': ''}
                ]
            };
            let filterColl: ColumnsModel[] = [
                {field: 'FirstName', label: 'First Name', type: 'string'},
                {field: 'EmployeeID', label: 'Employee ID', type: 'number'},
                {field: 'LastName', label: 'Last Name', type: 'string'}
            ];
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: filterColl,
                rule: valRule
            }, '#querybuilder');
            let filterElem: DropDownList = queryBuilder.element.querySelectorAll('.e-rule-filter .e-control')[0].ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[2].click();
        });
    });
    describe('Platform Specific Column Template', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            let template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider e-template"></div></div>';
            document.body.appendChild(template);
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Template Checking', () => {
            let customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', template:'#template' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            let valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                }] 
            };
            
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: customFieldData,
                rule: valRule,
                actionBegin: (args: any) => {
                    if (args.requestType === 'value-template-create') {     
                        let defaultNumber: number = 31;
                        if (args.rule.value === '') {
                            args.rule.value = defaultNumber;
                        }
                        valueObj = new Slider({
                            value: args.rule.value as number, min: 30, max: 50,
                            ticks: { placement: 'Before', largeStep: 5, smallStep: 1 },
                            change: (e: any) => {
                                let elem: HTMLElement = valueObj.element;
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            let slider: Slider = queryBuilder.element.querySelector('.e-control.e-slider').ej2_instances[0];
            slider.value = 30; slider.dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual(30);
            let filterElem:DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            filterElem = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            filterElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
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
            let customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'Date', label: 'Date', type: 'date', operators: [{key: 'equal', value: 'equal'}, {key: 'between', value: 'between'}], template: '#template' },
                { field: 'BirthDate', label: 'BirthDate', type: 'date', operators: [{ key: 'between', value: 'between' }], template: '#betweentemplate' }
            ];
            let valRule: RuleModel = {'condition': 'and',
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
                                    placeholder:"Select Range",
                                    change: (e: any) => {
                                        let elem: HTMLElement = dateRangeObj.element;
                                        queryBuilder.notifyChange(e.value as Date[], elem, 'value');
                                    }
                                });
                                dateRangeObj.appendTo('#' + args.ruleID + '_valuekey0');
                            } else {
                                dateObj = new DatePicker({
                                    placeholder:"Select Range",
                                    change: (e: any) => {
                                        let elem: HTMLElement = dateObj.element;
                                        queryBuilder.notifyChange(e.value as Date, elem, 'value');
                                    }
                                });
                                dateObj.appendTo('#' + args.ruleID + '_valuekey0');
                            }
                        } else {
                            var dateArr = [];
                            dateObj = new DatePicker({
                                placeholder:"Select Range",
                                change: (e: any) => {
                                    let elem: HTMLElement = dateObj.element;
                                    dateArr = [];
                                    dateArr.push(e.value); dateArr.push(dateObj2.value);
                                    queryBuilder.notifyChange(dateArr, elem, 'value');
                                }
                            });
                            dateObj2 = new DatePicker({
                                placeholder:"Select Range",
                                change: (e: any) => {
                                    let elem: HTMLElement = dateObj.element;
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
            let dateRngObj: DateRangePicker = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[2].ej2_instances;
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
            let template: Element = createElement('script', { id: 'template' });
            template.setAttribute('type', 'text/x-template');
            template.innerHTML = '<div class="e-rule e-rule-template"><div class="e-rule-filter"><input id = ${ruleID}_filterkey class="e-filter-input"></div><div class="e-rule-operator e-operator"><input id = ${ruleID}_operatorkey class="e-operator-input"></div><div class="e-value e-rule-value e-slider-value"><div id = ${ruleID}_valuekey0 class="ticks_slider"></div></div><div class="e-rule-btn"><button class="e-removerule e-rule-delete e-css e-btn e-small e-round"><span class="e-btn-icon e-icons e-delete-icon"/></button></div></div>';
            document.body.appendChild(template);
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Rule Template Checking', () => {
            let customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', ruleTemplate:'#template' },
                { field: 'FirstName', label: 'First Name', type: 'string' },
                { field: 'City', label: 'City', type: 'string' },
                {
                    field: 'Amount', label: 'Amount', type: 'number', template: {
                        create: () => {
                            let elem: Element = document.createElement('div');
                            elem.setAttribute('class', 'ticks_slider');
                            return elem;
                        },
                        destroy: (args: { elementId: string }) => {
                            (getComponent(document.getElementById(args.elementId), 'slider') as Slider).destroy();
                        },
                        write: (args: { elements: Element, values: string }) => {
                            let slider: Slider = new Slider({
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
                    }
                },
                { 
                    field: 'Stock', label: 'Stock', type: 'boolean', template: {
                        create: () => {
                            return createElement("input", { attrs: { type: "checkbox" } });
                        },
                        destroy: (args: { elementId: string }) => {
                            (getComponent(document.getElementById(args.elementId),"checkbox") as CheckBox).destroy();
                        },
                        write: (args: { elements: Element; values: string }) => {
                            let checked: boolean = args.values === "Yes" ? true : false;
                            const boxObj: CheckBox = new CheckBox({
                                label: "In Stock",
                                checked: checked,
                                value: args.values === "Yes" ? "Yes": "No",
                                change: (e: any) => {
                                    queryBuilder.notifyChange(e.checked ? "Yes" : "No", e.event.target);
                                }
                            });
                            boxObj.appendTo("#" + args.elements.id);
                        }
                    }
                }
            ];
            let valRule: RuleModel = {'condition': 'and',
                'rules': [{
                    'label': 'Employee ID',
                    'field': 'EmployeeID',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 32
                },
                {
                    'label': 'FirstName',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'equal',
                    'value': 'dfd'
                },
                {
                    'condition': 'and',
                    'rules': [{
                        'label': 'FirstName',
                        'field': 'FirstName',
                        'type': 'string',
                        'operator': 'equal',
                        'value': 'dfd'
                    }]
                },
                {
                    'label': 'FirstName',
                    'field': 'FirstName',
                    'type': 'string',
                    'operator': 'equal',
                    'value': 'dfd'
                },
                {
                    'label': 'Amount',
                    'field': 'Amount',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 30
                },
                {
                    'label': 'Stock',
                    'field': 'Stock',
                    'type': 'boolean',
                    'operator': 'equal',
                    'value': true
                }]
            };
            let valueObj: Slider;
            queryBuilder = new QueryBuilder({
                dataSource: complexData,
                columns: customFieldData,
                rule: valRule,
                separator: '.',
                actionBegin: (args: any) => {
                    if (args.requestType === 'template-create') {
                        let defaultNumber: number = 31;    
                        let fieldObj: DropDownList = new DropDownList({
                            dataSource: queryBuilder.columns, // tslint:disable-line
                            fields: args.fields,
                            value: args.rule.field,
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'field');
                            }
                        });
                        let operatorObj: DropDownList = new DropDownList({
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
                                let elem: HTMLElement = document.querySelector('.e-rule-value .e-control.e-slider');
                                queryBuilder.notifyChange(e.value, elem, 'value');
                            }
                        });
                        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
                        operatorObj.appendTo('#' + args.ruleID + '_operatorkey');
                        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
                    }
                }
            }, '#querybuilder');
            expect(queryBuilder.getRule('group0_rule0').field).toEqual('EmployeeID');
            expect(queryBuilder.getRule(document.getElementById('querybuilder_group0_rule0')).field).toEqual('EmployeeID');
            expect(queryBuilder.getGroup(document.getElementById('querybuilder_group0')).condition).toEqual('and');
            let slider: Slider = queryBuilder.element.querySelector('.e-control.e-slider').ej2_instances[0];
            slider.value = 30; slider.dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual(30);
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-operator-input.e-control').ej2_instances;
            operatorElem[0].showPopup();
            let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[1].click();
            operatorElem = queryBuilder.element.querySelector('.e-operator-input.e-control').ej2_instances;
            operatorElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            itemsCln[0].click();
            let fieldElem: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            fieldElem = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            queryBuilder.addRules([{'label': 'First Name', 'field': 'FirstName', 'type': 'string', 'operator': 'equal', 'value': 'Nancy'}], 'group0');
            expect(queryBuilder.getValues('FirstName')[0].FirstName).toEqual('Nancy');
            expect(queryBuilder.getValues('Height')[0].Height).toEqual('5.5');
            expect(queryBuilder.getValues('Address.City')[0].Address.City).toEqual('Seattle');
            expect(queryBuilder.getValues('Address.PostalCode')[0].Address.PostalCode).toEqual('98.122');
            fieldElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[1].ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule1_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            fieldElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[3].ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule3_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            fieldElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[4].ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule4_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            fieldElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[5].ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule5_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            fieldElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[1].ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule1_filterkey_options').querySelectorAll('li');
            itemsCln[1].click();
            fieldElem = queryBuilder.element.querySelectorAll('.e-filter-input.e-control')[0].ej2_instances;
            fieldElem[0].showPopup();
            itemsCln = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemsCln[0].click();
            queryBuilder.deleteRules(['group0_rule0']);
        });
    });
    describe('Platform Specific Header Template', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            let template: Element = createElement('script', { id: 'headerTemplate' });
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
            let customFieldData: ColumnsModel[] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
                { field: 'FirstName', label: 'First Name', type: 'string' }
            ];
            let valRule: RuleModel = {'condition': 'and',
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
                        let checkBoxObj: CheckBox = new CheckBox({ 
                            label: 'NOT', checked: args.notCondition,
                            change: function(e:any){
                                queryBuilder.notifyChange(e.checked,e.event.target, 'not')
                            }
                         });
                        checkBoxObj.appendTo('#' + args.ruleID + '_notoption');
                        let ds: { [key: string]: Object }[] = [{'key': 'AND', 'value': 'and'},{'key': 'OR', 'value': 'or'}];
                        let btnObj: DropDownList= new DropDownList({
                            dataSource: ds, fields: { text: 'key', value: 'value' },
                            value: args.condition, cssClass: 'e-custom-group-btn e-active-toggle',
                            change: (e: any) => {
                                queryBuilder.notifyChange(e.value, e.element, 'condition');
                            }
                        });
                        btnObj.appendTo('#' + args.ruleID + '_cndtnbtn');
                        let ddbitems: ItemModel[] = [
                            { text: 'AddGroup', iconCss: 'e-icons e-add-icon e-addgroup' },
                            { text: 'AddCondition', iconCss: 'e-icons e-add-icon e-addrule' }
                        ];
                        let addbtn: DropDownButton = new DropDownButton({
                            items: ddbitems,
                            cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                            iconCss: 'e-icons e-add-icon',
                            select: function(event: any) {
                                let addbtn: Element = closest(event.element,'.e-dropdown-popup');  let ddb: string[]= addbtn.id.split('_');
                                if (event.item.text === 'AddGroup') {
                                    queryBuilder.addGroups([{condition: 'and', 'rules': [{}], not: false}], ddb[1]);
                                } else if (event.item.text === 'AddCondition') {
                                    queryBuilder.addRules([{}], ddb[1]);
                                }
                            }
                        });
                        addbtn.appendTo('#' + args.ruleID + '_addbtn');
                        let deleteGroup: Element =  document.getElementById(args.ruleID).querySelector('.e-delete-btn');
                        if (deleteGroup) {
                            (deleteGroup as HTMLElement).onclick = function (e:any) {
                                queryBuilder.deleteGroup(closest(e.target.offsetParent, '.e-group-container'));
                            }
                        }
                    }
                }
            }, '#querybuilder');
            document.getElementById('querybuilder_group0_addbtn').click();
            let itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_addbtn-popup').querySelectorAll('li');
            itemCln[0].click();
            (<HTMLElement>document.querySelector('#querybuilder_group0_notoption')).click();
            let condtion: DropDownList = queryBuilder.element.querySelector('#querybuilder_group0_cndtnbtn').ej2_instances[0];
            condtion.showPopup();
            itemCln = document.getElementById('querybuilder_group0_cndtnbtn_popup').querySelectorAll('li');
            itemCln[1].click();
        });
    });
    describe('model binding support', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Model Binding with DataSource', () => {
            let cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101 },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan'},
                { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM'},
                { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy', value: '2/07/1991' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'},
            ];
            let iRules: RuleModel = {
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
            let cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101 },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan'},
                { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM'},
                { field: 'HireDate', label: 'HireDate', type: 'date', value: '2/07/1991' },
                { field: 'Date', label: 'Date', type: 'date', format: 'short', value: '2/07/1991' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'},
            ];
            let iRules: RuleModel = {
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
            let importRules: RuleModel = {
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
            let columns: ColumnsModel[] = [
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
                enableNotCondition: true,
            }, '#querybuilder');
            let filter: DropDownList = queryBuilder.element.querySelector('.e-filter-input.e-control').ej2_instances[0];
            filter.showPopup();
            let itemCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            itemCln[1].click();
            queryBuilder.reset();
            queryBuilder.setRulesFromSql("Employee.ID = 0 AND Name.LastName LIKE ('%malan%') AND (Country.State.City LIKE ('U%') AND Country.Region LIKE ('%c') AND Country.Name IS NOT EMPTY)");
            queryBuilder.reset();
            queryBuilder.setRules(importRules);
        });
        it('Complex Databinding Support without datasource', () => {
            let importRules: RuleModel = {
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
            let columns: ColumnsModel[] = [
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
                enableNotCondition: true,
            }, '#querybuilder');
        });
        it('Complex Databinding Support without columns', () => {
            let importRules: RuleModel = {
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
            }, '#querybuilder');
        });
    });
    describe('Customer_Bugs', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('EJ2-26551-Selected value not maintained properly for field checkbox in querybuilder', () => {
            let cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101 },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan'},
                { field: 'Title Of Courtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM'},
                { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy', value: '2/07/1991' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'},
                { field: 'City', label: 'City', type: 'string' , value: 'MS'},
            ];
            let iRules: RuleModel = {
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
           let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
           operatorElem[0].showPopup();
           let itemsCln: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
           itemsCln[1].click();
           expect(operatorElem[0].value).toEqual('notequal');
           expect(queryBuilder.rule.rules[0].operator).toEqual('notequal');
           expect(queryBuilder.rule.rules[0].value).toEqual('Mr.');
           let radioBtnCln: NodeListOf<HTMLElement> = document.querySelectorAll('.e-radio');
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
            let cData: ColumnsModel [] = [
                { field: 'EmployeeID', label: 'Employee ID', type: 'number', value: 101, category: 'Employee Details' },
                { field: 'FirstName', label: 'FirstName', type: 'string', value: 'Mohan', category: 'Employee Details'},
                { field: 'Title Of Courtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'], value: 'Mrs.', category: 'Title Details' },
                { field: 'Title', label: 'Title', type: 'string', value: 'MMM', category: 'Title Details'},
                { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy', value: '2/07/1991', category: 'Title Details' },
                { field: 'Country', label: 'Country', type: 'string' , value: 'India'},
                { field: 'City', label: 'City', type: 'string' , value: 'MS'},
            ];
            let iRules: RuleModel = {
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
			let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances[0];
            filterElem.showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_filterkey_options').querySelectorAll('li');
            expect(items[0].textContent).toEqual('Employee Details');
            expect(items[3].textContent).toEqual('Title Details');
            expect(items[7].textContent).toEqual('Other Fields'); 
        });

    });

    describe('Events', () => {
        afterEach(() => {
            queryBuilder.destroy();
        });
    });


    describe('notify property changes of', () => {
        afterEach(() => {
            queryBuilder.destroy();
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
    describe('Data Manager', () => {
        let data: DataManager = new DataManager({
            url: 'https://js.syncfusion.com/ejServices/Wcf/Northwind.svc/Orders/',
            adaptor: new ODataAdaptor
        });
        let valRule: RuleModel = {
            'condition': 'and',
            'rules': [
                {'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string', 'operator': 'equal', 'value': 'BERGS'},
            ] 
        };
        let columns: ColumnsModel[] = [
            { field: 'EmployeeID', label: 'Employee ID', type: 'string' },
            { field: 'OrderID', label: 'Order ID', type: 'string' },
            { field: 'CustomerID', label: 'CustomerID', type: 'string' }
        ];
        function createQB(options: QueryBuilderModel, done: Function): QueryBuilder {
            let dataBound: EmitType<Object> = () => {
                setTimeout(function(){ 
                    done();
                }, 3000);
            };
            options.dataBound = dataBound;
            let qb: QueryBuilder = new QueryBuilder(options);
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
            qb.appendTo('#querybuilder');
            return qb;
        }
        beforeAll((done: Function)=> {
            queryBuilder = createQB({
                dataSource: data,
                columns: columns,
                rule: valRule
            }, done);
        });
        afterAll(() => {
            remove(queryBuilder.element);
            queryBuilder.destroy();
        });
        it('Remote Data Checking', (done: Function) => {
            let msObj: TextBox = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances[0];
            expect(msObj.value).toEqual('BERGS');
            done();
        });
        it('Multi Select Data Checking', (done: Function) => {
            let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            let items: NodeListOf<HTMLElement> = document.getElementById('querybuilder_group0_rule0_operatorkey_options').querySelectorAll('li');
            items[5].click();
            expect(operatorElem[0].value).toEqual('in');
            let msObj: MultiSelect = queryBuilder.element.querySelector('.e-rule-value input.e-control').ej2_instances[0];
            msObj.showPopup();
            done();
        });
    });
});