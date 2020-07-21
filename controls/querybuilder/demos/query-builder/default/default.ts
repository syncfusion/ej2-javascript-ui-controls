/**
 * CheckBox Default Sample
 */
import { QueryBuilder , RuleModel} from './../../../src/query-builder/index';
import { employeeData } from '../data-source';
import { addClass, removeClass, getComponent } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

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
let qryBldrObj: QueryBuilder = new QueryBuilder({ 
	dataSource: employeeData, 
	rule: importRules, 
	enableNotCondition: true,
    displayMode: "Horizontal", 
	allowValidation: true,
	created: created,
	change: fieldChange
});
qryBldrObj.appendTo('#querybuilder');

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

      // var qbID = this.qryBldrObj.element.id + "_";
      // var ruleElem = document.getElementById(qbID + args.ruleID);
      // if (args.type === "insertRule") {
      //   this.applyFilter(ruleElem);
      // }
      // var elem = document.getElementById(qbID + args.ruleID + "_filterkey");
      // var tempColumn = this.qryBldrObj.getColumn(args.value);
      // if (args.type === 'field') {
      //   this.qryBldrObj.getRule(elem).operator = '';
      //   getComponent(document.getElementById(qbID + '' + args.ruleID + '_operatorkey'), 'dropdownlist').index = null;
      //   addClass(closest(elem, '.e-rule-container').querySelectorAll('.e-rule-value'), 'e-hide');
      // } else if (args.type === 'operator'){
      //   removeClass(closest(elem, '.e-rule-container').querySelectorAll('.e-rule-value'), 'e-hide');
      // }
    }
	
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
document.getElementById('material-dark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material-dark.css');
};
document.getElementById('fabric-dark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric-dark.css');
};
document.getElementById('bootstrap-dark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap-dark.css');
};
document.getElementById('bootstrap4').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    removeClass([qryBldrObj.element], 'e-bigger');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap4.css');
};
