/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, ColumnsModel, RulesModel, RuleModel } from '../src/query-builder/index';
import { createElement, remove, select, selectAll, detach, getComponent } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
MultiSelect.Inject(CheckBoxSelection);
/**
 * @param  {} 'Button'
 * @param  {} function(
 */

describe('QueryBuilder', () => {
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
        }
    ];

    let importRules: RulesModel = {
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
            }], 'querybuilder_e_groupundefined');
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
            }], 'querybuilder_e_groupundefined');
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
            expect(selectAll('.e-summary-content', queryBuilder.element).length).toBe(1);
        });

        it('disable summaryView testing', () => {
            queryBuilder = new QueryBuilder({
                summaryView: false,
            }, '#querybuilder');
            expect(selectAll('.e-summary-content', queryBuilder.element).length).toBe(0);
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
            let filterElem: DropDownList = queryBuilder.element.querySelector('.e-rule-filter .e-control').ej2_instances;
            expect(filterElem[0].value).toEqual('EmployeeID');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('number');
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
            let items: Element[] = operatorElem[0].popupObj.element.querySelectorAll('li');
            operatorElem[0].setSelection(items[3]);
            //expect(operatorElem[0].value).toEqual('between');
            //expect(queryBuilder.rule.rules[0].operator).toEqual('between');
            //expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control').length).toBe(3);
            //Change the numeric textbox value 
            valueElem = queryBuilder.element.querySelector('.e-rule-value .e-control').ej2_instances;
            ele = valueElem[0].spinUp;
            mouseEvent.initEvent("mousedown", true, true);
            ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent("mouseup", true, true);
            ele.dispatchEvent(mouseEvent2);
           // expect(valueElem[0].value).toEqual(1);
           // expect(queryBuilder.rule.rules[0].value[0]).toEqual(1);

            valueElem = queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[1].ej2_instances;
            ele = valueElem[0].spinUp;
            mouseEvent.initEvent("mousedown", true, true);
           // ele.dispatchEvent(mouseEvent);
            mouseEvent2.initEvent("mouseup", true, true);
           // ele.dispatchEvent(mouseEvent2);
            //expect(valueElem[0].value).toEqual(1);
            //expect(queryBuilder.rule.rules[0].value[1]).toEqual(1);

            //Change the operator
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            operatorElem[0].showPopup();
            items = operatorElem[0].popupObj.element.querySelectorAll('li');
            operatorElem[0].setSelection(items[8]);
            expect(operatorElem[0].value).toEqual('in');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control').length).toBe(2);
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control').classList.contains('e-multiselect')).toBeTruthy;

            //Change the field
            filterElem[0].showPopup();
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            items = filterElem[0].popupObj.element.querySelectorAll('li');
            filterElem[0].setSelection(items[1]);
            expect(filterElem[0].value).toEqual('FirstName');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('string');

           // expect(operatorElem[0].value).toEqual('startswith');
           // expect(queryBuilder.rule.rules[0].operator).toEqual('startswith');
           // expect(queryBuilder.element.querySelector('.e-rule-value .e-control').classList.contains('e-textbox')).toBeTruthy;

            //Change the field
            filterElem[0].showPopup();
            items = filterElem[0].popupObj.element.querySelectorAll('li');
            filterElem[0].setSelection(items[2]);
            operatorElem = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('boolean');
            operatorElem[0].showPopup();
            items = operatorElem[0].popupObj.element.querySelectorAll('li');
            operatorElem[0].setSelection(items[0]);
            expect(operatorElem[0].value).toEqual('equal');
            expect(queryBuilder.rule.rules[0].operator).toEqual('equal');
            expect(queryBuilder.element.querySelector('.e-rule-value .e-control').classList.contains('e-radio')).toBeTruthy;

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

            expect(queryBuilder.dataSource.length).toBe(0);
            // setmodel datasource
            queryBuilder.dataSource = employeeData;
            queryBuilder.dataBind();
            expect(queryBuilder.dataSource.length).toBe(3);

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
            expect(document.getElementsByClassName('e-summary-content')[0].querySelector('textarea').value).toEqual("EmployeeID = 1 or Title = 'Sales Manager'");
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
            let items: Element[] = filterElem[0].popupObj.element.querySelectorAll('li');
            filterElem[0].setSelection(items[4]);
            expect(filterElem[0].value).toEqual('Date');
            expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('date');
            expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-datepicker')).toBeTruthy;

             // Field change
             filterElem[0].showPopup();
             items = filterElem[0].popupObj.element.querySelectorAll('li');
             filterElem[0].setSelection(items[1]);
             expect(filterElem[0].value).toEqual('PaymentMode');
             expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('string');
             expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-dropdownlist')).toBeTruthy;

          // Field change
          filterElem[0].showPopup();
          items = filterElem[0].popupObj.element.querySelectorAll('li');
          filterElem[0].setSelection(items[2]);
          expect(filterElem[0].value).toEqual('TransactionType');
          expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('boolean');
          expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-checkbox')).toBeTruthy;

          // Field change
          filterElem[0].showPopup();
          items = filterElem[0].popupObj.element.querySelectorAll('li');
          filterElem[0].setSelection(items[5]);
          expect(filterElem[0].value).toEqual('Amount');
          expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('number');
          expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-slider')).toBeTruthy;

           // Field change
           filterElem[0].showPopup();
           items = filterElem[0].popupObj.element.querySelectorAll('li');
           filterElem[0].setSelection(items[3]);
           expect(filterElem[0].value).toEqual('Description');
           expect(filterElem[0].dataSource[filterElem[0].index].type).toEqual('string');
           expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-textbox')).toBeTruthy;

           //Operator change
           let operatorElem: DropDownList = queryBuilder.element.querySelector('.e-rule-operator .e-control').ej2_instances;
           operatorElem[0].showPopup();
           items = operatorElem[0].popupObj.element.querySelectorAll('li');
           operatorElem[0].setSelection(items[5]);
           expect(operatorElem[0].value).toEqual('in');
           expect(queryBuilder.element.querySelectorAll('.e-rule-value .e-control')[0].classList.contains('e-multiselect')).toBeTruthy;

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
                rule: eRules
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
            }], 'querybuilder_e_groupundefined');
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(2);
            queryBuilder.deleteRules(['querybuilder_e_groupundefined_e_rule0']);
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
            }], 'querybuilder_e_groupundefined');
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            queryBuilder.deleteGroups(['querybuilder_e_group0']);
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
            }], 'querybuilder_e_groupundefined');
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            let rules: RuleModel = queryBuilder.getRules();
            expect(rules.rules.length).toBe(2);
            expect(rules.rules[1].rules.length).toBe(1);
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
});