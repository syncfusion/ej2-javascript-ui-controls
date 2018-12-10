/**
 * CheckBox Default Sample
 */
import { QueryBuilder , RuleModel, ColumnsModel, Validation} from './../../../src/query-builder/index';
import { getComponent } from '@syncfusion/ej2-base';
import { orderData } from '../data-source';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
MultiSelect.Inject(CheckBoxSelection);
let elem: HTMLElement;
let dropDownObj: DropDownList;
let multiSelectObj: MultiSelect;
let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect).destroy();
        },
        write: (args: {elements: Element, values: string[]}) => {
            multiSelectObj = new MultiSelect({
                dataSource: [1, 2, 3, 4, 5],
                value: args.values,
                mode: 'Box',
                change: (e: any) => {
                    qbObj.notifyChange(e.value, e.element);
                }
            });
            multiSelectObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'CustomerID', label: 'CustomerID', type: 'number', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'dropdownlist') as DropDownList).destroy();
        },
        write: (args: {elements: Element, values: string}) => {
            let ds: string [] = ['ALFKI', 'BERGS', 'BLONP', 'OTTIK'];
            dropDownObj = new DropDownList({
                dataSource: ds,
                value: args.values ? args.values[0] : ds[0],
                change: (e: any) => {
                    qbObj.notifyChange(e.itemData.value, e.element);
                }
            });
            dropDownObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'OrderID', label: 'OrderID', type: 'number', validation: {isRequired : true} as Validation},
    { field: 'in_stock', label: 'In stock', type: 'boolean'},
    { field: 'price', label: 'Price', type: 'string'},
    { field: 'Date', label: 'Date', type: 'date'}
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
                'value':[10]
            }]
        }]
    }]
    };
let qbObj: QueryBuilder = new QueryBuilder({ cssClass: 'e-rule1', columns: filter,
    height: 'auto', width: 'auto' , showButtons: {groupDelete: true, groupInsert: true, ruleDelete: true}, displayMode: 'Horizontal',
    dataSource: orderData, allowValidation: false,  sortDirection: 'Ascending', maxGroupCount: 5, rule: importRules });
qbObj.appendTo('#querybuilder');


//setrules
let buttonElem: Element  = qbObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-primary', id: 'setrules'}});
buttonElem.textContent = 'SetRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('setrules').onclick = (): void => {
    qbObj.setRules(importRules);
}

//addrules
buttonElem = qbObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-success', id: 'addrules'}});
buttonElem.textContent = 'AddRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('addrules').onclick = (): void => {
    qbObj.addRules([
        {'label': 'CustomerID', 'field': 'CustomerID', 'type': 'string',  'operator': 'Equal', 'value': ['ALFKI']},
        {'label': 'OrderID', 'field': 'OrderID', 'type': 'number', 'operator': 'Between', 'value': [10260] }
    ], 'e_group0');
};

//addgroup
buttonElem = qbObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-success', id: 'addgroups'}});
buttonElem.textContent = 'AddGroups';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('addgroups').onclick = (): void => {
    qbObj.addGroups([
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
buttonElem = qbObj.createElement('Button', { attrs: {type: 'button', class: 'e-control e-btn e-danger', id: 'deleterule'}});
buttonElem.textContent = 'DeleteRule';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('deleterule').onclick = (): void => {
    qbObj.deleteRules(['e_group1_e_rule0']);
};

//deleteGroup
buttonElem = qbObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-danger', id: 'deletegroup'}});
buttonElem.textContent = 'DeleteGroup';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('deletegroup').onclick = (): void => {
    qbObj.deleteGroups(['e_group2']);
};

//reset rules
buttonElem = qbObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-warning', id: 'reset'}});
buttonElem.textContent = 'Reset';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('reset').onclick = (): void => {
    qbObj.reset();
};

//getrules
buttonElem = qbObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-warning', id: 'getrules'}});
buttonElem.textContent = 'GetRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('getrules').onclick = (): void => {
    //qbObj.reset();
    dialogObj.content = JSON.stringify({condition: qbObj.rule.condition, rule: qbObj.rule.rules});
    dialogObj.show();
};

//Column Mode
buttonElem = qbObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-info', id: 'columnmode'}});
buttonElem.textContent = 'ColumnMode';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('columnmode').onclick = (): void => {
    if (qbObj.displayMode === 'Vertical') {
        qbObj.displayMode = 'Horizontal';
    } else {
        qbObj.displayMode = 'Vertical';
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