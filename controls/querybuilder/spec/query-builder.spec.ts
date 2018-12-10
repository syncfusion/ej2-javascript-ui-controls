/**
 *  QueryBuilder spec document
 */
import { QueryBuilder, ColumnsModel, RulesModel, RuleModel } from '../src/query-builder/index';
import { createElement, remove, select, selectAll } from '@syncfusion/ej2-base';

/**
 * @param  {} 'Button'
 * @param  {} function(
 */
describe('QueryBuilder', () => {
    let queryBuilder: any;

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
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            queryBuilder = null;
            //queryBuilder.destroy();
        });
        it('displayMode testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                displayMode: 'Vertical'
            }, '#querybuilder');
            expect(queryBuilder.displayMode).toEqual('Vertical');
        });
        it('height and width testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData,
                height: '200px',
                width: '500px'
            }, '#querybuilder');
            expect(queryBuilder.height).toEqual('200px');
            expect(queryBuilder.width).toEqual('500px');
        });
        it('sortDirection testing', () => {
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
    });

    describe('Public Methods', () => {
        beforeEach((): void => {
            document.body.appendChild(createElement('div', { id: 'querybuilder' }));
        });
        afterEach(() => {
            remove(queryBuilder.element.nextElementSibling);
            remove(queryBuilder.element);
            //queryBuilder = null;
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
                columns: columnData1
            }, '#querybuilder');
            queryBuilder.getSqlFromRules(importRules1);
            expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(1);
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
            //expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
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
            //expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            queryBuilder.deleteGroups(['querybuilder_e_group0']);
            //expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
        });

        it('reset testing', () => {
            queryBuilder = new QueryBuilder({
                columns: columnData
            }, '#querybuilder');
            queryBuilder.setRules(importRules);
            // expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(3);
            // expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(6);
            queryBuilder.reset();
            // expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(1);
            // expect(selectAll('.e-rule-container', queryBuilder.element).length).toBe(0);
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
            //expect(selectAll('.e-group-container', queryBuilder.element).length).toBe(2);
            let rules: RuleModel = queryBuilder.getRules();
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