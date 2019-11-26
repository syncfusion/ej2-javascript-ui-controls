/**
 * CheckBox Default Sample
 */
import { QueryBuilder, RuleModel, ColumnsModel , RuleChangeEventArgs} from './../../../src/query-builder/index';
import { getComponent } from '@syncfusion/ej2-base';
import { RadioButton, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
MultiSelect.Inject(CheckBoxSelection);
let columnData: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
    { field: 'FirstName', label: 'FirstName', type: 'string'},
    { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
    { field: 'Title', label: 'Title', type: 'string'},
    { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy' },
    { field: 'Country', label: 'Country', type: 'string' },
    { field: 'City', label: 'City', type: 'string' },
];
let importRules: RuleModel = {
    'condition': 'and',
        'rules': [{
                'label': 'EmployeeID',
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
                        'operator': 'equal',
                        'value': 'Sales Manager'
                    },
                    {
                        'label': 'Title Of Courtesy',
                        'field': 'TitleOfCourtesy',
                        'type': 'boolean',
                        'operator': 'equal',
                        'value': ['Mr.']
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
                                'label': 'HireDate',
                                'field': 'HireDate',
                                'type': 'date',
                                'operator': 'equal',
                                'value': '07/07/1027'
                            }]
                    }]
            }]
    };
let queryBldrObj: QueryBuilder = new QueryBuilder({
    width: '850px',
    columns: columnData,
    rule: importRules,
    ruleChange: updateRule
});
queryBldrObj.appendTo('#querybuilder');

let radioButton: RadioButton = new RadioButton({
    label: 'JSON Rule',
    name: 'rule',
    value: 'json',
    checked: true,
    change: changeValue
});
radioButton.appendTo('#radio1');

radioButton = new RadioButton({
    label: 'SQL Rule',
    name: 'rule',
    value: 'sql',
    change: changeValue
});
radioButton.appendTo('#radio2');
let element: Element = document.getElementById('ruleContent');
function updateRule(args: RuleChangeEventArgs): void {
    if ((getComponent(radioButton.element as HTMLElement, 'radio') as RadioButton).checked) {
        element.textContent = queryBldrObj.getSqlFromRules(args.rule);
    } else {
        element.textContent = JSON.stringify(args.rule, null, 4);
    }
}
element.textContent = JSON.stringify({ condition: queryBldrObj.rule.condition, rules: queryBldrObj.rule.rules }, null, 4);
function changeValue(args: ChangeEventArgs): void {
    element = document.getElementById('ruleContent');
    let validRule: RuleModel = queryBldrObj.getValidRules(queryBldrObj.rule);
    if (args.event.target['value'] === 'json') {
        element.textContent = JSON.stringify(validRule, null, 4);
    } else {
        element.textContent = queryBldrObj.getSqlFromRules(validRule);

    }
}