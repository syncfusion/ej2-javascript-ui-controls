/**
 * CheckBox Default Sample
 */
import { QueryBuilder ,RuleModel} from './../../../src/query-builder/index';
import { DataManager, ODataAdaptor } from '@syncfusion/ej2-data';

import { Dialog } from '@syncfusion/ej2-popups';

let data: DataManager = new DataManager({
    url: 'https://js.syncfusion.com/ejServices/Wcf/Northwind.svc/Orders/',
    adaptor: new ODataAdaptor
});

let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'CustomerID',
        'field': 'CustomerID',
        'type': 'string',
        'operator': 'notequal',
        'value': 'VINET'
    },
    {
        'condition': 'or',
        'rules': [{
            'label': 'Freight',
            'field': 'Freight',
            'type': 'number',
            'operator': 'equal',
            'value': 14
        },
        {
            'label': 'CustomerID',
            'field': 'CustomerID',
            'type': 'string',
            'operator': 'in',
            'value': ['BERGS']
        },
        {
        'condition': 'and',
            'rules': [{
                'label': 'OrderID',
                'field': 'OrderID',
                'type': 'number',
                'operator': 'equal',
                'value': 10
            }]
        }]
    }]
    };
let queryBldrObj: QueryBuilder = new QueryBuilder({ 
	dataSource: data,
	rule:importRules
});
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
        {'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string',  'operator': 'equal', 'value': 'ALFKI'},
        {'label': 'OrderID', 'field': 'OrderID', 'type': 'number', 'operator': 'notequal', 'value': 10260 }
    ], 'group0');
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
                'label': 'CustomerID',
                'field': 'CustomerID',
                'type': 'string',
                'operator': 'in',
                'value': ['VINET']
            }]
        },
        {
            'condition': 'and',
            'rules': [{
                'label': 'in stock',
                'field': 'in stock',
                'type': 'string',
                'operator': 'equal',
                'value': ['Yes']
            },
            {
                'label': 'OrderID',
                'field': 'OrderID',
                'type': 'number',
                'operator': 'equal',
                'value': 10260
            }]
        }], 'group0');
};

//deleterules
buttonElem = queryBldrObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-danger', id: 'deleterule'}});
buttonElem.textContent = 'DeleteRule';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('deleterule').onclick = (): void => {
    queryBldrObj.deleteRules(['group4_rule7']);
};

//deleteGroup
buttonElem = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-danger', id: 'deletegroup'}});
buttonElem.textContent = 'DeleteGroup';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('deletegroup').onclick = (): void => {
    queryBldrObj.deleteGroups(['group4']);
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
    dialogObj.content = JSON.stringify({
        condition: queryBldrObj.rule.condition,
        rules: queryBldrObj.rule.rules
    }, null, 4);
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