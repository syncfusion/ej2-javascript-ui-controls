/**
 * CheckBox Default Sample
 */
import { QueryBuilder, RuleModel, ColumnsModel, ActionEventArgs} from './../../../src/query-builder/index';
import { Slider } from '@syncfusion/ej2-inputs';
import { employeeData } from '../data-source';

let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number'},
    { field: 'FirstName', label: 'FirstName', type: 'string'},
    { field: 'LastName', label: 'LastName', type: 'string'},
    { field: 'Age', label: 'Age', type: 'number', template: '#ageTemplate'},
    { field: 'City', label: 'City', type: 'string'},
    { field: 'Country', label: 'Country', type: 'string'},
];

let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'Age',
        'field': 'Age',
        'type': 'number',
        'operator': 'equal',
        'value': 34
    }]
};

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
    if (args.requestType === 'value-template-create') {     
        let defaultNumber: number = 31;
        if (args.rule.value === '') {
            args.rule.value = defaultNumber;
        }
        valueObj = new Slider({
            value: args.rule.value as number,
            min: 30,
            max: 50,
            ticks: { placement: 'Before', largeStep: 5, smallStep: 1, showSmallTicks: true },
            change: (e: any) => {
                let elem: HTMLElement = valueObj.element;
                queryBldrObj.notifyChange(e.value, elem, 'value');
            }
        });
        valueObj.appendTo('#' + args.ruleID + '_valuekey0');
    }
}
