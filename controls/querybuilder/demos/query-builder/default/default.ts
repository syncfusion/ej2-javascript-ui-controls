/**
 * CheckBox Default Sample
 */
import { QueryBuilder , RuleModel, ColumnsModel} from './../../../src/query-builder/index';
import { employeeData } from '../data-source';
import { addClass, removeClass } from '@syncfusion/ej2-base';

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
            'field': 'TitleOfCourtesy',
            'label': 'Title Of Courtesy',
            'type': 'boolean',
            'operator': 'equal',
            'value': 'Mr.'
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
let qryBldrObj: QueryBuilder = new QueryBuilder({ dataSource: employeeData, columns: columnData, rule: importRules,
    displayMode: "Horizontal", allowValidation: true });
qryBldrObj.appendTo('#querybuilder');


document.getElementById('material').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
};
document.getElementById('fabric').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
};
document.getElementById('bootstrap').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
};
document.getElementById('highcontrast').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
};

document.getElementById('materialdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material-dark.css');
};

document.getElementById('fabricdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric-dark.css');
};

document.getElementById('bootstrapdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap-dark.css');
};

document.getElementById('highcontrastlight').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast-light.css');
};
document.getElementById('materialtouch').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
};
document.getElementById('fabrictouch').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
};
document.getElementById('bootstraptouch').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
};
document.getElementById('highcontrasttouch').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
};

document.getElementById('materialdarktouch').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material-dark.css');
};

document.getElementById('fabricdarktouch').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric-dark.css');
};

document.getElementById('bootstrapdarktouch').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap-dark.css');
};

document.getElementById('highcontrastlighttouch').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    addClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast-light.css');
};
