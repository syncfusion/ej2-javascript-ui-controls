/**
 * CheckBox Default Sample
 */
import { QueryBuilder, RuleModel, ColumnsModel, ActionEventArgs} from './../../../src/query-builder/index';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
import { employeeData } from '../data-source';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { compile } from '@syncfusion/ej2-base';

let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number'},
    { field: 'FirstName', label: 'FirstName', type: 'string'},
    { field: 'LastName', label: 'LastName', type: 'string'},
    { field: 'Age', label: 'Age', type: 'number', ruleTemplate: '#ageTemplate'},
    { field: 'City', label: 'City', type: 'string'},
    { field: 'Country', label: 'Country', type: 'string'},
];

let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'EmployeeID',
        'field': 'EmployeeID',
        'type': 'number',
        'operator': 'notequal',
        'value': 1
    }]
};

let fieldObj: DropDownList;
let valueObj: Slider;
let ruleID: string;

let queryBldrObj: QueryBuilder = new QueryBuilder({ 
    columns: filter,
    dataSource: employeeData,
    rule: importRules,
    width: '70%',
    actionBegin: actionBegin
});
queryBldrObj.appendTo('#querybuilder');

function actionBegin(args: ActionEventArgs): void {
    ruleID = args.ruleID;
    if (args.requestType === 'template-create') {     
        args.rule.operator = 'between';      
        fieldObj = new DropDownList({
            dataSource: this.columns, // tslint:disable-line
            fields: args.fields,
            value: args.rule.field,
            change: (e: any) => {
                queryBldrObj.notifyChange(e.value, e.element, 'field');
            }
        });
        let numArray: number[] = [30, 50];
        if (args.rule.value === '') {
            args.rule.value = numArray;
        }
        valueObj = new Slider({
            value: args.rule.value as number[],
            min: 30,
            max: 50,
            type: 'Range',
            ticks: { placement: 'Before', largeStep: 5, smallStep: 1, showSmallTicks: true },
            change: (e: any) => {
                let elem: HTMLElement = valueObj.element;
                queryBldrObj.notifyChange(e.value, elem, 'value');
                refreshTable(queryBldrObj.getRule(elem), elem.id.split('_valuekey0')[0]);
            },
			created: () => {
				let elem: HTMLElement = valueObj.element;
				refreshTable(queryBldrObj.getRule(elem), elem.id.split('_valuekey0')[0]);
			}
        });
        fieldObj.appendTo('#' + args.ruleID + '_filterkey');
        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
    }
}

function refreshTable(rule: RuleModel, ruleID: string) {
    let template: string = '<tr><td>${EmployeeID}</td><td>${FirstName}</td><td>${Age}</td></tr>';
    let compiledFunction: Function = compile(template);
    let predicate = queryBldrObj.getPredicate({condition: 'and', rules: [rule]});
    let dataManagerQuery: Query = new Query().select(['EmployeeID', 'FirstName', 'Age']).where(predicate);
    let result: Object[] = new DataManager(employeeData).executeLocal(dataManagerQuery);
    let table: HTMLElement = (<HTMLElement>document.querySelector('#' + ruleID + '_section #datatable'));
    if (result.length) {
        table.style.display = 'block';
    } else {
        table.style.display = 'none';
    }
    table.querySelector('tbody').innerHTML = '';
    result.forEach((data: Object) => {
        table.querySelector('tbody').appendChild(compiledFunction(data)[0].querySelector('tr'));
    });
}
