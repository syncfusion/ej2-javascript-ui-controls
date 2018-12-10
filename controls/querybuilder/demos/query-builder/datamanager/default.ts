/**
 * CheckBox Default Sample
 */
import { QueryBuilder ,RuleModel} from './../../../src/query-builder/index';
import { DataManager, Query, ReturnOption, Predicate } from '@syncfusion/ej2-data';
import { getComponent, compile } from '@syncfusion/ej2-base';
import { orderData } from '../data-source';
import { Dialog } from '@syncfusion/ej2-popups';
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
let queryBldrObj: QueryBuilder = new QueryBuilder({ cssClass: 'e-rule1',
    height: 'auto', width: 'auto' , showButtons: {groupDelete: true, groupInsert: true, ruleDelete: true}, displayMode: 'Horizontal',
    dataSource: orderData, allowValidation: false,  sortDirection: 'Ascending', maxGroupCount: 5 });
queryBldrObj.appendTo('#querybuilder');


//setrules
let buttonElem: Element  = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-primary',
 id: 'setrules'}});
buttonElem.textContent = 'SetRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('setrules').onclick = (): void => {
    queryBldrObj.setRules(importRules);
}

//addrules
buttonElem = queryBldrObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-success', id: 'addrules'}});
buttonElem.textContent = 'AddRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('addrules').onclick = (): void => {
    queryBldrObj.addRules([
        {'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string',  'operator': 'Equal', 'value': ['ALFKI']},
        {'label': 'OrderID', 'field': 'OrderID', 'type': 'number', 'operator': 'Between', 'value': [10260] }
    ], 'e_group0');
};

//addgroup
buttonElem = queryBldrObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-success', id: 'addgroups'}});
buttonElem.textContent = 'AddGroups';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('addgroups').onclick = (): void => {
    queryBldrObj.addGroups([
        {
            'condition': 'and',
            'rules': [{
                'label': 'EmployeeID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'In',
                'value': [4, 5]
            }]
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
                'value': [10260]
            }]
        }], 'e_group0');
};

//deleterules
buttonElem = queryBldrObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-danger', id: 'deleterule'}});
buttonElem.textContent = 'DeleteRule';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('deleterule').onclick = (): void => {
    queryBldrObj.deleteRules(['e_group1_e_rule0']);
};

//deleteGroup
buttonElem = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-danger', id: 'deletegroup'}});
buttonElem.textContent = 'DeleteGroup';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('deletegroup').onclick = (): void => {
    queryBldrObj.deleteGroups(['e_group2']);
};

//reset rules
buttonElem = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-warning', id: 'reset'}});
buttonElem.textContent = 'Reset';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('reset').onclick = (): void => {
    queryBldrObj.reset();
};

//getrules
buttonElem = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-warning', id: 'getrules'}});
buttonElem.textContent = 'GetRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('getrules').onclick = (): void => {
    //queryBldrObj.reset();
    dialogObj.content = JSON.stringify(queryBldrObj.rule);
    dialogObj.show();
};

//Column Mode
buttonElem = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-info', id: 'columnmode'}});
buttonElem.textContent = 'ColumnMode';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('columnmode').onclick = (): void => {
    if (queryBldrObj.displayMode === 'Vertical') {
        queryBldrObj.displayMode = 'Horizontal';
    } else {
        queryBldrObj.displayMode = 'Vertical';
    }
};

let dialogObj: Dialog = new Dialog({
    width: '750px',
    header: 'Rules',
    target: document.getElementById('target'),
    isModal: true,
    animationSettings: { effect: 'None' },
    buttons: [{
        click: dlgButtonClick,
        buttonModel: { content: 'OK', isPrimary: true }
    }],
});
dialogObj.appendTo('#modalDialog');
dialogObj.hide();
function dlgButtonClick(): void {
    dialogObj.hide();
}