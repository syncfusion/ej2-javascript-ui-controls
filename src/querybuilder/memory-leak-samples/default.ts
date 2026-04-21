/**
 * CheckBox Default Sample
 */
import { ActionEventArgs, ColumnsModel, QueryBuilder , RuleModel} from '../src/query-builder/index';
import { employeeData } from '../demos/query-builder/data-source';
import { addClass, removeClass, getComponent, closest } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';

let qryBldrObj: QueryBuilder;
let queryBldrObj1: QueryBuilder;
let queryBldrObj2: QueryBuilder;
let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number'},
    { field: 'FirstName', label: 'FirstName', type: 'string'},
    { field: 'LastName', label: 'LastName', type: 'string'},
    { field: 'Age', label: 'Age', type: 'number', template: '#ageTemplate'},
    { field: 'City', label: 'City', type: 'string'},
    { field: 'Country', label: 'Country', type: 'string', ruleTemplate:"#ruleTemplate"}
];

let importRules: RuleModel = {
    'condition': 'or',
    'rules': [{
        'label': 'Title',
        'field': 'Title',
        'type': 'string',
        'operator': 'contains',
        'value':'Sales Manager'
    }]
};

let importRules1: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'Age',
        'field': 'Age',
        'type': 'number',
        'operator': 'equal',
        'value': 34
    }]
};

let importRules2: RuleModel = {
    'condition': 'and', 'not' : true, 
    'rules': [
        {
            'label': 'Country',
            'field': 'Country',
            'type': 'string',
            'operator': 'equal',
            'value': "USA"
        }
    ]
};
function renderQueryBuilder() {
    qryBldrObj = new QueryBuilder({ 
        dataSource: employeeData, 
        rule: importRules,
        enableNotCondition: true,
        displayMode: "Horizontal", 
        allowValidation: true,
        created: created,
        change: fieldChange
    });
    qryBldrObj.appendTo('#querybuilder');
    queryBldrObj1 = new QueryBuilder({ 
        columns: filter,
        dataSource: employeeData,
        rule: importRules1,
        width: '70%',
        actionBegin: actionBegin
    });
    queryBldrObj1.appendTo('#querybuilder1');
    queryBldrObj2 = new QueryBuilder({ 
        columns: filter,
        dataSource: employeeData,
        rule: importRules2,
        width: '70%',
        headerTemplate: '#headerTemplate',
        actionBegin: actionBegin2,
        enableNotCondition: true
    });
    queryBldrObj2.appendTo('#querybuilder2');
}
function destroyQueryBuilder() {
    if (qryBldrObj) {
        qryBldrObj.destroy();
        qryBldrObj = null;
    }
    if (queryBldrObj1) {
        queryBldrObj1.destroy();
        queryBldrObj1 = null;
    }
    if (queryBldrObj2) {
        queryBldrObj2.destroy();
        queryBldrObj2 = null;
    }
}
	function applyFilter(elem: HTMLElement): void {
      var qbID = qryBldrObj.element.id + "_";
      if (elem) {
        var ddlgrp = elem.querySelectorAll("input[id *= 'filterkey']");
        for (var i = 0; i < ddlgrp.length; i++) {
          let ddlObj: DropDownList = getComponent(ddlgrp[i] as HTMLElement, "dropdownlist") as DropDownList;
          ddlObj.allowFiltering = true;
          ddlObj.dataBind();
        }
      }
    }

    function created(): void {
      // let elem: HTMLElement = document as HTMLElement;
      // applyFilter(elem as HTMLElement);
    }
    
    function fieldChange(args: any): void {
      var qbID = qryBldrObj.element.id + "_";
       var ruleElem = document.getElementById(qbID + args.ruleID);
       if (args.type === "insertRule") {
        applyFilter(ruleElem);
      }

    }
    
    let valueObj: Slider;
    
    
    function actionBegin(args: ActionEventArgs): void {
        if (args.requestType === 'value-template-initialize') {
            if (args.operator === 'in') {
                args.renderTemplate = false;
            }
        }
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
                    queryBldrObj1.notifyChange(e.value, elem, 'value');
                }
            });
            valueObj.appendTo('#' + args.ruleID + '_valuekey0');
        }
    }
    document.getElementById('render').addEventListener('click', renderQueryBuilder);
    document.getElementById('destroy').addEventListener('click', destroyQueryBuilder);
    let fieldObj: DropDownList;
    let valueObj3: DropDownList;
    let operatorObj0: RadioButton;
    let operatorObj1: RadioButton;

    let val: { [key: string]: Object }[] = [
        { field: 'USA', label: 'USA' },
        { field: 'england', label: 'England' },
        { field: 'india', label: 'India' },
        { field: 'spain', label: 'Spain'}
    ];

    

    function actionBegin2(args: ActionEventArgs): void {
        if (args.requestType === 'header-template-create') {
            let checkBoxObj: CheckBox = new CheckBox({ 
                label: 'NOT',
                checked: args.notCondition,
                change: function(e:any){
                    queryBldrObj2.notifyChange(e.checked,e.event.target, 'not')
                }
             });
            checkBoxObj.appendTo('#' + args.ruleID + '_notoption');
            let ds: { [key: string]: Object }[] = [{'key': 'AND', 'value': 'and'},{'key': 'OR', 'value': 'or'}];
            let btnObj: DropDownList= new DropDownList({
                dataSource: ds,
                fields: { text: 'key', value: 'value' },
                value: args.condition,
                cssClass: 'e-custom-group-btn e-active-toggle',
                change: (e: any) => {
                    queryBldrObj2.notifyChange(e.value, e.element, 'condition');
                }
            });
            btnObj.appendTo('#' + args.ruleID + '_cndtnbtn');
            let ddbitems: ItemModel[] = [
                { text: 'AddGroup', iconCss: 'e-icons e-add-icon e-addgroup' },
                { text: 'AddCondition', iconCss: 'e-icons e-add-icon e-addrule' }
            ];
            let addbtn: DropDownButton = new DropDownButton({
                items: ddbitems,
                cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                iconCss: 'e-icons e-add-icon',
                select: function(event: MenuEventArgs) {
                    let addbtn: Element = closest(event.element,'.e-dropdown-popup');  let ddb: string[]= addbtn.id.split('_');
                    if (event.item.text === 'AddGroup') {
                        queryBldrObj2.addGroups([{condition: 'and', 'rules': [{}], not: false}], ddb[1]);
                    } else if (event.item.text === 'AddCondition') {
                        queryBldrObj2.addRules([{}], ddb[1]);
                    }
                }
            });
            addbtn.appendTo('#' + args.ruleID + '_addbtn');
            let deleteGroup: Element =  document.getElementById(args.ruleID).querySelector('.e-delete-btn');
            if (deleteGroup) {
                (deleteGroup as HTMLElement).onclick = function (e:any) {
                    queryBldrObj2.deleteGroup(closest(e.target.offsetParent, '.e-group-container'));
                }
            }
        }

        if (args.requestType === 'template-create') {         
            fieldObj = new DropDownList ({
                dataSource: this.columns,
                fields: args.fields,
                value: args.rule.field,
                change: (e: any) => {
                    queryBldrObj2.notifyChange(e.value, e.element, 'field');
                }
            });
            fieldObj.appendTo('#' + args.ruleID + '_filterkey');
            operatorObj0 = new RadioButton ({
                label:'Is Equal',
                name:'operator',
                value:'equal',
                checked: args.rule.operator === 'equal'? true : false,
                change: function (e) {
                    queryBldrObj2.notifyChange(e.value, e.event.target as Element, 'operator');
                }
            });
            operatorObj0.appendTo('#' + args.ruleID + '_operatorkey0');
            operatorObj1 = new RadioButton ({
                label:'Is Not Equal',
                name:'operator',
                value:'notequal',
                checked: args.rule.operator === 'notequal'? true : false,
                change: function (e) {
                    queryBldrObj2.notifyChange(e.value, e.event.target as Element, 'operator');
                }
            });

            operatorObj1.appendTo('#' + args.ruleID + '_operatorkey1');
            valueObj3 = new DropDownList ({
                dataSource: val,
                fields: args.fields,
                value: args.rule.value as any,
                change: (e: any) => {
                    queryBldrObj2.notifyChange(e.value, e.element, 'value');
                }
            });
            valueObj3.appendTo('#' + args.ruleID + '_valuekey');
        }
    }