/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, ColumnsModel,  RuleModel } from '../src/query-builder/index';
import { createElement, remove, select, selectAll, detach, getComponent } from '@syncfusion/ej2-base';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { profile , inMB, getMemoryProfile } from './common.spec';

MultiSelect.Inject(CheckBoxSelection);

/**
 * @param  {} 'Button'
 * @param  {} function(
 */
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
        { field: 'Date', label: 'Date', type: 'date' },
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
                        // Initialize tooltip with placement and showOn
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
        }, {
            'label': 'Amount',
            'field': 'Amount',
            'type': 'number',
            'operator': 'equal',
            'value': 10
        }
        ]
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
                summaryView: true,
            }, '#querybuilder');
            expect(queryBuilder.element.querySelectorAll('.e-collapse-rule').length).toBe(1);
        });

        it('disable summaryView testing', () => {
            queryBuilder = new QueryBuilder({
                summaryView: false,
            }, '#querybuilder');
            expect(queryBuilder.element.querySelectorAll('.e-collapse-rule').length).toBe(0);
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
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-datepicker')).toBeTruthy();

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
            // multiple select 
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
            queryBuilder = new QueryBuilder({
                columns: columnData1,
                rule: importRules1
            }, '#querybuilder');
            expect(queryBuilder.getSqlFromRules(importRules1)).toEqual("Category LIKE ('%Laptop')");
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
        });

        it('setRules from sql rule testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData1
            }, '#querybuilder');
            queryBuilder.setRules(queryBuilder.getRulesFromSql("Category LIKE ('%Laptop')"));
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
        });
        it('getDataManagerQuery', () => {
            queryBuilder = new QueryBuilder({
                dataSource: employeeData,
                columns: buttonData,
                rule: dataRules
            }, '#querybuilder');
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
            queryBuilder.deleteGroups(['group1']);
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
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
            cObj[0].value = new Date('11/11/2015');
            cObj[0].dataBind();
            expect(queryBuilder.rule.rules[0].value).toEqual('11/11/2015');
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
            queryBuilder.updateRules( queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0], 'US,45,45,4', 0);
           
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
});