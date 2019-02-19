import { Animation, Browser, ChildProperty, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, addClass, classList, closest, detach, extend, getComponent, getInstance, getValue, isNullOrUndefined, removeClass, rippleEffect } from '@syncfusion/ej2-base';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { CheckBoxSelection, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { DataManager, Deferred, Predicate, Query } from '@syncfusion/ej2-data';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Tooltip } from '@syncfusion/ej2-popups';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Query Builder Source
 */
MultiSelect.Inject(CheckBoxSelection);
class Columns extends ChildProperty {
}
__decorate([
    Property(null)
], Columns.prototype, "field", void 0);
__decorate([
    Property(null)
], Columns.prototype, "label", void 0);
__decorate([
    Property(null)
], Columns.prototype, "type", void 0);
__decorate([
    Property(null)
], Columns.prototype, "values", void 0);
__decorate([
    Property(null)
], Columns.prototype, "operators", void 0);
__decorate([
    Property(null)
], Columns.prototype, "template", void 0);
__decorate([
    Property({ isRequired: true, min: 0, max: Number.MAX_VALUE })
], Columns.prototype, "validation", void 0);
__decorate([
    Property(null)
], Columns.prototype, "format", void 0);
__decorate([
    Property(null)
], Columns.prototype, "step", void 0);
class Rules extends ChildProperty {
}
__decorate([
    Property('')
], Rules.prototype, "condition", void 0);
__decorate([
    Property()
], Rules.prototype, "rules", void 0);
__decorate([
    Property(null)
], Rules.prototype, "field", void 0);
__decorate([
    Property(null)
], Rules.prototype, "label", void 0);
__decorate([
    Property(null)
], Rules.prototype, "type", void 0);
__decorate([
    Property(null)
], Rules.prototype, "operator", void 0);
__decorate([
    Property(null)
], Rules.prototype, "value", void 0);
class Rule extends ChildProperty {
}
__decorate([
    Property('and')
], Rule.prototype, "condition", void 0);
__decorate([
    Property()
], Rule.prototype, "rules", void 0);
class ShowButtons extends ChildProperty {
}
__decorate([
    Property(true)
], ShowButtons.prototype, "ruleDelete", void 0);
__decorate([
    Property(true)
], ShowButtons.prototype, "groupInsert", void 0);
__decorate([
    Property(true)
], ShowButtons.prototype, "groupDelete", void 0);
let QueryBuilder = class QueryBuilder extends Component {
    constructor(options, element) {
        super(options, element);
    }
    getPersistData() {
        return this.addOnPersist(['rule']);
    }
    /**
     * Clears the rules without root rule.
     * @returns void.
     */
    reset() {
        this.isImportRules = false;
        let bodeElem = this.element.querySelector('.e-group-body');
        bodeElem.innerHTML = '';
        bodeElem.appendChild(this.createElement('div', { attrs: { class: 'e-rule-list' } }));
        this.levelColl[this.element.id + '_e_group0'] = [0];
        this.rule = { condition: 'and', rules: [] };
    }
    getWrapper() {
        return this.element;
    }
    getModuleName() {
        return 'query-builder';
    }
    initialize() {
        if (this.dataColl.length) {
            let columnKeys = Object.keys(this.dataColl[0]);
            let cols = [];
            let type;
            let isDate = false;
            let value;
            let validateObj = { isRequired: true, min: 0, max: Number.MAX_VALUE };
            if (this.columns.length) {
                this.columnSort();
                let columns = this.columns;
                for (let i = 0, len = columns.length; i < len; i++) {
                    if (!columns[i].type) {
                        if (columnKeys.indexOf(columns[i].field) > -1) {
                            value = this.dataColl[0][columns[i].field];
                            type = typeof value;
                            if (type === 'string') {
                                isDate = !isNaN(Date.parse(value));
                            }
                            else if (type === 'object') {
                                isDate = value instanceof Date && !isNaN(value.getTime());
                                type = 'string';
                            }
                            columns[i].type = type;
                            isDate = false;
                        }
                        type = 'string';
                    }
                    if (!columns[i].validation) {
                        columns[i].validation = validateObj;
                    }
                }
            }
            else {
                for (let i = 0, len = columnKeys.length; i < len; i++) {
                    value = this.dataColl[0][columnKeys[i]];
                    type = typeof value;
                    if (type === 'string') {
                        isDate = !isNaN(Date.parse(value));
                    }
                    else if (type === 'object') {
                        isDate = value instanceof Date && !isNaN(value.getTime());
                        type = 'string';
                    }
                    cols[i] = { 'field': columnKeys[i], 'label': columnKeys[i], 'type': isDate ? 'date' : type,
                        'validation': validateObj };
                    isDate = false;
                }
                this.columns = cols;
            }
        }
    }
    clickEventHandler(event) {
        let target = event.target;
        this.isImportRules = false;
        if (target.tagName === 'SPAN') {
            target = target.parentElement;
        }
        if (target.className.indexOf('e-collapse-rule') > -1) {
            let animation = new Animation({ duration: 1000, delay: 0 });
            let summaryElem = document.getElementById(this.element.id + '_summary_content');
            let txtareaElem = summaryElem.querySelector('.e-summary-text');
            animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
            let groupElem = this.element.querySelector('.e-group-container');
            groupElem.style.display = 'none';
            txtareaElem.textContent = this.getSqlFromRules(this.rule);
            summaryElem.style.display = 'block';
            txtareaElem.style.height = txtareaElem.scrollHeight + 'px';
        }
        if (target.tagName === 'BUTTON') {
            if (target.className.indexOf('e-removerule') > -1) {
                if (target.className.indexOf('e-tooltip') > -1) {
                    getComponent(target, 'tooltip').destroy();
                }
                this.deleteRule(target);
            }
            else if (target.className.indexOf('e-deletegroup') > -1) {
                getComponent(target, 'tooltip').destroy();
                this.deleteGroup(closest(target, '.e-group-container'));
            }
            else if (target.className.indexOf('e-edit-rule') > -1) {
                let animation = new Animation({ duration: 1000, delay: 0 });
                animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
                document.getElementById(this.element.id + '_summary_content').style.display = 'none';
                if (this.element.querySelectorAll('.e-group-container').length < 1) {
                    this.addGroupElement(false, this.element, this.rule.condition);
                    let mRules = extend({}, this.rule, {}, true);
                    this.setGroupRules(mRules);
                    this.renderSummaryCollapse();
                }
                else {
                    let groupElem = this.element.querySelector('.e-group-container');
                    if (groupElem.querySelectorAll('.e-collapse-rule').length < 1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block';
                }
            }
        }
        else if (target.tagName === 'LABEL' && target.parentElement.className.indexOf('e-btn-group') > -1) {
            let element = closest(target, '.e-group-container');
            let args = { groupID: element.id, selectedItem: target, cancel: false };
            this.trigger('beforeConditionChange', args);
            let rule = this.getGroup(element);
            rule.condition = target.textContent.toLowerCase();
            args = { groupID: element.id, selectedItem: target };
            this.trigger('conditionChanged', args);
        }
    }
    selectBtn(target, event) {
        if (event.name === 'beforeOpen') {
            if (this.showButtons.groupInsert) {
                removeClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
            else {
                addClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
        }
        else if (event.element.children[0].className.indexOf('e-addrule') > -1) {
            this.addRuleElement(closest(target, '.e-group-container'), {});
        }
        else if (event.element.children[0].className.indexOf('e-addgroup') > -1) {
            this.addGroupElement(true, closest(target, '.e-group-container'), '', true);
        }
    }
    addRuleElement(target, rule) {
        let ruleElem = this.ruleElem.cloneNode(true);
        if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
            ruleElem.className = 'e-rule-container e-vertical-mode';
        }
        else {
            ruleElem.className = 'e-rule-container e-horizontal-mode';
        }
        let groupLevel;
        let rules;
        let i;
        let len;
        let dropDownList;
        let ruleListElem = target.querySelector('.e-rule-list');
        let element = ruleElem.querySelector('button');
        let height;
        if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
            element.textContent = this.l10n.getConstant('Remove');
            addClass([element], 'e-flat');
            addClass([element], 'e-primary');
        }
        else {
            addClass([element], 'e-round');
            addClass([element], 'e-icon-btn');
            let tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteRule') });
            tooltip.appendTo(element);
            element = this.createElement('span', { attrs: { class: 'e-btn-icon e-icons e-delete-icon' } });
            ruleElem.querySelector('button').appendChild(element);
        }
        ruleElem.setAttribute('id', target.id + '_e_rule' + this.ruleIdCounter);
        this.ruleIdCounter++;
        ruleElem.querySelector('.e-filter-input').setAttribute('id', ruleElem.id + '_filterkey');
        ruleListElem.appendChild(ruleElem);
        if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-rule-container') > -1) {
            if (ruleElem.className.indexOf('e-joined-rule') < 0) {
                ruleElem.className += ' e-joined-rule';
            }
            if (ruleElem.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                ruleElem.previousElementSibling.className += ' e-prev-joined-rule';
            }
        }
        if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-group-container') > -1 &&
            ruleElem.className.indexOf('e-separate-rule') < 0) {
            ruleElem.className += ' e-separate-rule';
        }
        height = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
        dropDownList = new DropDownList({
            dataSource: this.columns,
            fields: { text: 'label', value: 'field' },
            placeholder: this.l10n.getConstant('SelectField'),
            popupHeight: ((this.columns.length > 5) ? height : 'auto'),
            change: this.changeField.bind(this),
            value: rule ? rule.field : null
        });
        dropDownList.appendTo('#' + ruleElem.id + '_filterkey');
        this.filterIndex = dropDownList.index;
        groupLevel = this.levelColl[target.id];
        if (!this.isImportRules) {
            rules = this.rule;
            for (i = 0, len = groupLevel.length; i < len; i++) {
                rules = this.findGroupByIdx(groupLevel[i], rules, i === 0);
            }
            if (Object.keys(rule).length) {
                rules.rules.push({
                    'field': rule.field, 'type': rule.type, 'label': rule.label, 'operator': rule.operator, value: rule.value
                });
            }
            else {
                rules.rules.push({ 'field': '', 'type': '', 'label': '', 'operator': '', 'value': '' });
            }
        }
        if (Object.keys(rule).length) {
            this.changeRule(rule, {
                element: dropDownList.element,
                itemData: this.columns[this.filterIndex]
            });
        }
    }
    renderToolTip(element) {
        let tooltip = new Tooltip({ content: this.l10n.getConstant('ValidationMessage'),
            position: 'BottomCenter', cssClass: 'e-querybuilder-error' });
        tooltip.appendTo(element);
        tooltip.open(element);
    }
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    validateFields() {
        let isValid = true;
        if (this.allowValidation) {
            let i;
            let len;
            let fieldElem;
            let indexElem;
            let valArray = [];
            let groupElem;
            let index;
            let dropDownObj;
            let tempElem;
            let rule;
            let ruleElemCln = this.element.querySelectorAll('.e-rule-container');
            let validateRule;
            for (i = 0, len = ruleElemCln.length; i < len; i++) {
                groupElem = closest(ruleElemCln[i], '.e-group-container');
                rule = this.getGroup(groupElem);
                index = 0;
                indexElem = tempElem = ruleElemCln[i];
                dropDownObj = getComponent(ruleElemCln[i].querySelector('.e-rule-field input.e-control'), 'dropdownlist');
                validateRule = !isNullOrUndefined(dropDownObj.index) && this.columns[dropDownObj.index].validation;
                fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                if (validateRule && validateRule.isRequired) {
                    while (indexElem && indexElem.previousElementSibling !== null) {
                        indexElem = indexElem.previousElementSibling;
                        index++;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                    if (!rule.rules[index].field) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-operator input.e-control');
                    if (!rule.rules[index].operator) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    if (rule.rules[index].value instanceof Array) {
                        valArray = rule.rules[index].value;
                    }
                    if (isNullOrUndefined(rule.rules[index].value) || rule.rules[index].value === ''
                        || (rule.rules[index].value instanceof Array && valArray.length < 1)) {
                        let valElem = tempElem.querySelectorAll('.e-rule-value input.e-control');
                        isValid = false;
                        for (let j = 0, jLen = valElem.length; j < jLen; j++) {
                            let element = valElem[j];
                            let elem;
                            if (element.parentElement.className.indexOf('e-searcher') > -1) {
                                elem = closest(element, '.e-multi-select-wrapper');
                                if (elem.className.indexOf('e-tooltip') < 0) {
                                    this.renderToolTip(elem);
                                }
                            }
                            else if (valElem[j].parentElement.className.indexOf('e-tooltip') < 0) {
                                this.renderToolTip(valElem[j].parentElement);
                            }
                            j++;
                        }
                    }
                }
                else if (dropDownObj.element && isNullOrUndefined(dropDownObj.index)) {
                    if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                        this.renderToolTip(fieldElem.parentElement);
                    }
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    groupTemplate() {
        let groupElem;
        let grpBodyElem;
        let groupHdrElem;
        let rulesElem;
        let glueElem;
        let inputElem;
        let labelElem;
        let grpActElem;
        let groupBtn;
        groupElem = this.createElement('div', { attrs: { class: 'e-group-container' } });
        groupHdrElem = this.createElement('div', { attrs: { class: 'e-group-header' } });
        grpBodyElem = this.createElement('div', { attrs: { class: 'e-group-body' } });
        rulesElem = this.createElement('div', { attrs: { class: 'e-rule-list' } });
        groupElem.appendChild(groupHdrElem);
        grpBodyElem.appendChild(rulesElem);
        groupElem.appendChild(grpBodyElem);
        // create button group in OR and AND process
        glueElem = this.createElement('div', { attrs: { class: 'e-btn-group' } });
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-and', value: 'AND' } });
        inputElem.setAttribute('checked', 'true');
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-btn e-btngroup-and-lbl e-small' }, innerHTML: 'AND' });
        glueElem.appendChild(labelElem);
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-or', value: 'OR' } });
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-btn e-btngroup-or-lbl e-small' }, innerHTML: 'OR' });
        glueElem.appendChild(labelElem);
        groupHdrElem.appendChild(glueElem);
        grpActElem = this.createElement('div', { attrs: { class: 'e-group-action' } });
        groupBtn = this.createElement('button', { attrs: { type: 'button', class: 'e-add-btn' } });
        grpActElem.appendChild(groupBtn);
        groupHdrElem.appendChild(grpActElem);
        return groupElem;
    }
    ruleTemplate() {
        let ruleElem;
        let filterElem;
        let tempElem;
        let delBtnElem;
        let fieldElem;
        let clsName;
        ruleElem = this.createElement('div');
        fieldElem = this.createElement('div', { attrs: { class: 'e-rule-field' } });
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-filter' } });
        filterElem = this.createElement('input', { attrs: { type: 'text', class: 'e-filter-input' } });
        tempElem.appendChild(filterElem);
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-operator' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value-delete' } });
        if (this.showButtons.ruleDelete) {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small';
        }
        else {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small e-button-hide';
        }
        delBtnElem = this.createElement('button', { attrs: { class: clsName } });
        tempElem.appendChild(delBtnElem);
        fieldElem.appendChild(tempElem);
        ruleElem.appendChild(fieldElem);
        return ruleElem;
    }
    addGroupElement(isGroup, target, condition, isBtnClick) {
        if (this.element.querySelectorAll('.e-group-container').length >= this.maxGroupCount) {
            return;
        }
        let dltGroupBtn;
        let groupElem = this.groupElem.cloneNode(true);
        groupElem.setAttribute('id', this.element.id + '_e_group' + this.groupIdCounter);
        this.groupIdCounter++;
        let andInpElem = groupElem.querySelector('.e-btngroup-and');
        let orInpElem = groupElem.querySelector('.e-btngroup-or');
        let andLblElem = groupElem.querySelector('.e-btngroup-and-lbl');
        let orLblElem = groupElem.querySelector('.e-btngroup-or-lbl');
        andInpElem.setAttribute('id', this.element.id + '_and' + this.btnGroupId);
        orInpElem.setAttribute('id', this.element.id + '_or' + this.btnGroupId);
        andInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
        orInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
        andLblElem.setAttribute('for', this.element.id + '_and' + this.btnGroupId);
        orLblElem.setAttribute('for', this.element.id + '_or' + this.btnGroupId);
        this.btnGroupId++;
        if (isGroup) {
            let clsName = this.showButtons.groupDelete ? 'e-deletegroup' : 'e-deletegroup e-button-hide';
            dltGroupBtn = this.createElement('button', { attrs: { class: clsName } });
            let button = new Button({ iconCss: 'e-icons e-delete-icon', cssClass: 'e-small e-round' });
            button.appendTo(dltGroupBtn);
            let tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteGroup') });
            tooltip.appendTo(dltGroupBtn);
            rippleEffect(dltGroupBtn, { selector: '.deletegroup' });
            groupElem.querySelector('.e-group-action').appendChild(dltGroupBtn);
            let ruleList = target.querySelector('.e-rule-list');
            let grpLen = target.querySelectorAll('.e-group-container').length;
            ruleList.appendChild(groupElem);
            let level = this.levelColl[target.id].slice(0);
            level.push(grpLen);
            this.levelColl[groupElem.id] = level;
            if (!this.isImportRules) {
                this.addGroups([], target.id);
                if (isBtnClick) {
                    this.addRuleElement(groupElem, {});
                }
            }
        }
        else {
            target.appendChild(groupElem);
            this.levelColl[groupElem.id] = [0];
        }
        groupElem.querySelector('.e-btngroup-and').setAttribute('checked', 'true');
        if (condition === 'or') {
            groupElem.querySelector('.e-btngroup-or').setAttribute('checked', 'true');
        }
        let groupBtn = groupElem.querySelector('.e-add-btn');
        let btnObj = new DropDownButton({
            items: this.items,
            cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
            iconCss: 'e-icons e-add-icon',
            beforeOpen: this.selectBtn.bind(this, groupBtn),
            select: this.selectBtn.bind(this, groupBtn)
        });
        btnObj.appendTo(groupBtn);
        rippleEffect(groupBtn, { selector: '.e-round' });
    }
    notifyChange(value, element) {
        let tempColl = closest(element, '.e-rule-value').querySelectorAll('.e-template');
        let valueColl = [];
        for (let i = 0, iLen = tempColl.length; i < iLen; i++) {
            if (tempColl[i].nextElementSibling) {
                if (tempColl[i].nextElementSibling.className.indexOf('e-check') > -1) {
                    valueColl.push(tempColl[i].textContent);
                }
            }
        }
        this.updateRules(element, (tempColl.length > 1) ? valueColl : value);
    }
    changeValue(i, args) {
        let eventsArgs;
        let element;
        if (args.event) {
            element = args.event.target;
        }
        else {
            let multiSelectArgs = args;
            element = multiSelectArgs.element;
        }
        if (element.className.indexOf('e-day') > -1) {
            let calenderArgs = args;
            element = calenderArgs.element;
        }
        let groupElem = closest(element, '.e-group-container');
        let ruleElem = closest(element, '.e-rule-container');
        let dateElement = args;
        if (dateElement.element && dateElement.element.className.indexOf('e-datepicker') > -1) {
            element = dateElement.element;
        }
        let value;
        if (element.className.indexOf('e-radio') > -1) {
            value = getComponent(element, 'radio').label;
        }
        else if (element.className.indexOf('e-multiselect') > -1) {
            value = getComponent(element, 'multiselect').value;
        }
        else {
            value = args.value;
        }
        eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: value, cancel: false };
        this.trigger('beforeValueChange', eventsArgs);
        this.updateRules(element, value, i);
        eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: value, cancel: false };
        this.trigger('valueChanged', eventsArgs);
    }
    changeField(args) {
        if (args.isInteracted) {
            let groupElem = closest(args.element, '.e-group-container');
            let rules = this.getGroup(groupElem);
            let ruleElem = closest(args.element, '.e-rule-container');
            let index = 0;
            while (ruleElem && ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            this.changeRule(rules.rules[index], args);
        }
    }
    changeRule(rule, args) {
        if (!args.itemData) {
            return;
        }
        let tempRule = {};
        let ddlObj;
        let inOperator = ['in', 'notin'];
        let operatorList;
        let betweenOperator = ['between', 'notbetween'];
        let filterElem;
        let operatorElem;
        let oprElem;
        let prevOper = rule.operator ? rule.operator.toLowerCase() : '';
        filterElem = closest(args.element, '.e-rule-filter');
        operatorElem = closest(args.element, '.e-rule-operator');
        let dropDownObj = getComponent(args.element, 'dropdownlist');
        let element = closest(args.element, '.e-group-container');
        if (filterElem) {
            let ruleElem = closest(filterElem, '.e-rule-container');
            let eventsArgs = {
                groupID: element.id, ruleID: ruleElem.id, selectedItem: args.item, cancel: false
            };
            this.trigger('beforeFieldChange', eventsArgs);
            tempRule.type = this.columns[dropDownObj.index].type;
            if (ruleElem.querySelector('.e-template')) {
                rule.value = '';
            }
        }
        if (operatorElem) {
            let ruleElem = closest(operatorElem, '.e-rule-container');
            let eventsArgs = {
                groupID: element.id, ruleID: ruleElem.id, selectedItem: args.item, cancel: false
            };
            this.trigger('beforeOperatorChange', eventsArgs);
            tempRule.operator = args.itemData.value;
            let currOper = tempRule.operator.toLowerCase();
            if (inOperator.indexOf(currOper) > -1 || betweenOperator.indexOf(currOper) > -1) {
                filterElem = operatorElem.previousElementSibling;
                tempRule.type = rule.type;
                if (!(inOperator.indexOf(currOper) > -1 && inOperator.indexOf(prevOper) > -1) &&
                    !(betweenOperator.indexOf(currOper) > -1 && betweenOperator.indexOf(prevOper) > -1)) {
                    rule.value = [];
                }
            }
            else if (typeof rule.value === 'object') {
                rule.value = rule.value.length > 0 ? rule.value[0] : '';
            }
            if (args.previousItemData) {
                let prevValue = args.previousItemData.value.toLowerCase();
                if (prevValue.indexOf('between') > -1 || (prevValue.indexOf('in') > -1 && prevValue.indexOf('contains') < 0)) {
                    filterElem = operatorElem.previousElementSibling;
                    tempRule.type = rule.type;
                }
            }
            if ((inOperator.indexOf(currOper) > -1 && inOperator.indexOf(prevOper) > -1) ||
                (betweenOperator.indexOf(currOper) > -1 && betweenOperator.indexOf(prevOper) > -1)) {
                filterElem = null;
            }
        }
        if (filterElem) {
            operatorElem = filterElem.nextElementSibling;
            addClass([operatorElem], 'e-operator');
            if (operatorElem.childElementCount) {
                ddlObj = getComponent(operatorElem.querySelector('.e-dropdownlist'), 'dropdownlist');
                tempRule.operator = ddlObj.value;
                this.renderValues(operatorElem, args.itemData, args.previousItemData, true, rule, tempRule, args.element);
            }
            else {
                let ruleId = closest(operatorElem, '.e-rule-container').id;
                oprElem = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_operatorkey' } });
                operatorElem.appendChild(oprElem);
                if (this.columns[dropDownObj.index].operators) {
                    operatorList = this.columns[dropDownObj.index].operators;
                }
                else if (args.itemData) {
                    operatorList = this.customOperators[this.columns[dropDownObj.index].type + 'Operator'];
                }
                let height = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
                let dropDownList = new DropDownList({
                    dataSource: operatorList,
                    fields: { text: 'key', value: 'value' },
                    placeholder: this.l10n.getConstant('SelectOperator'),
                    popupHeight: ((operatorList.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this),
                    index: 0,
                    value: rule ? rule.operator : null
                });
                dropDownList.appendTo('#' + ruleId + '_operatorkey');
                tempRule.operator = (rule && rule.operator !== '') ? rule.operator : operatorList[0].value;
                if (this.isImportRules) {
                    tempRule.type = this.columns[dropDownObj.index].type;
                    tempRule.operator = rule.operator;
                }
                this.renderValues(operatorElem, this.columns[dropDownObj.index], args.previousItemData, false, rule, tempRule, args.element);
            }
        }
        if (!this.isImportRules) {
            this.updateRules(args.element, args.item);
        }
    }
    // tslint:disable-next-line:no-any
    destroyControls(target) {
        let inputElement;
        inputElement = target.nextElementSibling.querySelectorAll('input.e-control');
        let divElement;
        divElement = target.nextElementSibling.querySelectorAll('div.e-control:not(.e-handle)');
        let columns = this.columns;
        for (let i = 0, len = inputElement.length; i < len; i++) {
            if (inputElement[i].classList.contains('e-textbox')) {
                getComponent(inputElement[i], 'textbox').destroy();
                detach(target.nextElementSibling.querySelector('input#' + inputElement[i].id));
            }
            else if (inputElement[i].classList.contains('e-dropdownlist')) {
                getComponent(inputElement[i], 'dropdownlist').destroy();
            }
            else if (inputElement[i].classList.contains('e-radio')) {
                getComponent(inputElement[i], 'radio').destroy();
            }
            else if (inputElement[i].classList.contains('e-numerictextbox')) {
                getComponent(inputElement[i], 'numerictextbox').destroy();
                detach(target.nextElementSibling.querySelector('input#' + inputElement[i].id));
            }
            else if (inputElement[i].classList.contains('e-datepicker')) {
                getComponent(inputElement[i], 'datepicker').destroy();
            }
            else if (inputElement[i].classList.contains('e-multiselect')) {
                getComponent(inputElement[i], 'multiselect').destroy();
            }
            else if (inputElement[i].className.indexOf('e-template') > -1) {
                let clsName = inputElement[i].className;
                for (let j = 0, jLen = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], inputElement[i].id);
                        break;
                    }
                }
            }
            if (document.getElementById(inputElement[i].id)) {
                detach(inputElement[i]);
            }
        }
        for (let i = 0, len = divElement.length; i < len; i++) {
            if (divElement[i].className.indexOf('e-template') > -1) {
                let clsName = divElement[i].className;
                for (let j = 0, jLen = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], divElement[i].id);
                        break;
                    }
                }
            }
            detach(divElement[i]);
        }
    }
    templateDestroy(column, elemId) {
        let temp = column.template.destroy;
        if (column.template && column.template.destroy) {
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
                temp({ elementId: elemId });
            }
            else {
                column.template.destroy({ elementId: elemId });
            }
        }
    }
    getDistinctValues(dataSource, field) {
        let original = {};
        let result = [];
        for (let i = 0, iLen = dataSource.length; i < iLen; i++) {
            let value = dataSource[i][field];
            if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                value = dataSource[i][field].toString();
            }
            let data = {};
            if (!(value in original)) {
                original[value] = 1;
                data[field] = value;
                result.push(data);
            }
        }
        return result;
    }
    renderMultiSelect(rule, parentId, i, selectedValue) {
        let ds = this.getDistinctValues(this.dataColl, rule.field);
        let multiSelectObj = new MultiSelect({
            dataSource: new DataManager(ds),
            query: new Query([rule.field]),
            fields: { text: rule.field, value: rule.field },
            value: selectedValue,
            mode: 'CheckBox',
            width: '100%',
            change: this.changeValue.bind(this, i)
        });
        multiSelectObj.appendTo('#' + parentId + '_valuekey' + i);
    }
    processTemplate(target, itemData, rule, tempRule) {
        let tempElements = closest(target, '.e-rule-container').querySelectorAll('.e-template');
        if (tempElements.length < 2) {
            if (itemData.template && typeof itemData.template.write === 'string') {
                getValue(itemData.template.write, window)({ elements: tempElements[0], values: rule.value, operator: tempRule.operator });
            }
            else if (itemData.template && itemData.template.write) {
                itemData.template.write({ elements: tempElements[0], values: rule.value, operator: tempRule.operator });
            }
        }
        else {
            if (itemData.template && typeof itemData.template.write === 'string') {
                getValue(itemData.template.write, window)({ elements: tempElements, values: rule.value, operator: tempRule.operator });
            }
            else if (itemData.template && itemData.template.write) {
                itemData.template.write({ elements: tempElements, values: rule.value, operator: tempRule.operator });
            }
        }
    }
    renderStringValue(parentId, rule, operator, idx, ruleValElem) {
        let selectedVal;
        let selectedValue = this.isImportRules ? rule.value : '';
        if ((operator === 'in' || operator === 'notin') && this.dataColl.length) {
            selectedVal = this.isImportRules ? rule.value : [];
            this.renderMultiSelect(rule, parentId, idx, selectedVal);
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleValElem.style.width = '100%';
            }
            else {
                ruleValElem.style.width = null;
                ruleValElem.style.minWidth = '200px';
            }
        }
        else {
            if (operator === 'in' || operator === 'notin') {
                selectedVal = this.isImportRules ? rule.value : [];
                selectedValue = selectedVal.join(',');
            }
            let inputobj = new TextBox({
                placeholder: 'Value',
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selectedValue;
            inputobj.dataBind();
        }
    }
    renderNumberValue(parentId, rule, operator, idx, ruleValElem, itemData, length) {
        let selectedValue = this.isImportRules ? rule.value : 0;
        let selectedVal;
        if ((operator === 'in' || operator === 'notin') && this.dataColl.length) {
            selectedVal = this.isImportRules ? rule.value : [];
            this.renderMultiSelect(rule, parentId, idx, selectedVal);
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                ruleValElem.style.width = '100%';
            }
            else {
                ruleValElem.style.minWidth = '200px';
                ruleValElem.style.width = null;
            }
        }
        else if (operator === 'in' || operator === 'notin') {
            selectedVal = this.isImportRules ? rule.value : [];
            let selVal = selectedVal.join(',');
            let inputobj = new TextBox({
                placeholder: 'Value',
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selVal;
            inputobj.dataBind();
        }
        else {
            let fieldObj = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist');
            itemData = this.columns[fieldObj.index];
            let min = (itemData.validation && itemData.validation.min) ? itemData.validation.min : 0;
            let max = (itemData.validation && itemData.validation.max) ? itemData.validation.max : Number.MAX_VALUE;
            let format = itemData.format ? itemData.format : '#';
            if (length > 1 && rule) {
                selectedValue = rule.value[idx] ? rule.value[idx] : 0;
            }
            let numeric = new NumericTextBox({
                value: selectedValue,
                format: format, min: min, max: max, width: '100%',
                step: itemData.step ? itemData.step : 1,
                change: this.changeValue.bind(this, idx)
            });
            numeric.appendTo('#' + parentId + '_valuekey' + idx);
        }
    }
    processValueString(value, type) {
        let numArr = [];
        let strArr = value.split(',');
        if (type === 'string') {
            return strArr;
        }
        else {
            for (let k = 0, kLen = strArr.length; k < kLen; k++) {
                numArr.push(Number(strArr[k]));
            }
            return numArr;
        }
    }
    renderControls(target, itemData, rule, tempRule) {
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-value');
        if (itemData.template) {
            this.processTemplate(target, itemData, rule, tempRule);
        }
        else {
            let length = (tempRule.type === 'boolean' ||
                tempRule.operator && tempRule.operator.toLowerCase().indexOf('between') > -1) ? 2 : 1;
            let parentId = closest(target, '.e-rule-container').id;
            let ruleValElem;
            if (target.className.indexOf('e-rule-operator') > -1 || target.className.indexOf('e-rule-filter') > -1) {
                ruleValElem = target.parentElement.querySelector('.e-rule-value');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    ruleValElem.style.width = '100%';
                }
                else {
                    if (tempRule.operator !== 'in' && tempRule.operator !== 'notin') {
                        ruleValElem.style.width = '200px';
                    }
                }
                for (let i = 0; i < length; i++) {
                    switch (tempRule.type) {
                        case 'string':
                            {
                                this.renderStringValue(parentId, rule, tempRule.operator, i, ruleValElem);
                            }
                            break;
                        case 'number':
                            {
                                this.renderNumberValue(parentId, rule, tempRule.operator, i, ruleValElem, itemData, length);
                            }
                            break;
                        case 'boolean':
                            {
                                let values = itemData.values && itemData.values.length ? itemData.values : ['True', 'False'];
                                let isCheck = this.isImportRules ? Boolean(rule.value) : true;
                                let radiobutton = new RadioButton({
                                    label: values[i], name: parentId + 'default', checked: isCheck,
                                    change: this.changeValue.bind(this, i)
                                });
                                radiobutton.appendTo('#' + parentId + '_valuekey' + i);
                            }
                            break;
                        case 'date':
                            {
                                let selectedValue = new Date();
                                let selVal;
                                if (this.isImportRules && rule && rule.value) {
                                    selectedValue = (length > 1) ? new Date(rule.value[i]) : new Date(rule.value);
                                    let format;
                                    let column = this.getColumn(rule.field);
                                    selVal = (length > 1) ? rule.value[i] : rule.value;
                                    format = { type: 'dateTime', format: column.format || 'MM/dd/yyyy' };
                                    selectedValue = this.intl.parseDate(selVal, format);
                                }
                                let format = itemData.format ? itemData.format : 'MM/dd/yyyy';
                                let datepick = new DatePicker({
                                    value: selectedValue, format: format,
                                    change: this.changeValue.bind(this, i)
                                });
                                datepick.appendTo('#' + parentId + '_valuekey' + i);
                            }
                            break;
                    }
                }
            }
        }
    }
    renderValues(target, itemData, prevItemData, isRender, rule, tempRule, element) {
        if (isRender) {
            let ddlObj = getComponent(target.querySelector('input'), 'dropdownlist');
            if (itemData.operators) {
                ddlObj.dataSource = itemData.operators;
                ddlObj.index = ddlObj.index !== 0 ? 0 : 1;
                ddlObj.dataBind();
                tempRule.operator = ddlObj.value;
            }
            else if (itemData.type) {
                ddlObj.dataSource = this.customOperators[itemData.type + 'Operator'];
                ddlObj.index = ddlObj.index !== 0 ? 0 : 1;
                ddlObj.dataBind();
                tempRule.operator = ddlObj.value;
            }
        }
        let parentId = closest(target, '.e-rule-container').id;
        if (prevItemData && prevItemData.template) {
            this.templateDestroy(prevItemData, parentId + '_valuekey0');
            detach(target.nextElementSibling.querySelector('#' + parentId + '_valuekey0'));
        }
        if (isRender) {
            this.destroyControls(target);
        }
        let filtElem = document.getElementById(element.id.replace('operatorkey', 'filterkey'));
        let filtObj = getComponent(filtElem, 'dropdownlist');
        itemData.template = this.columns[filtObj.index].template;
        if (itemData.template) {
            itemData.template = this.columns[filtObj.index].template;
            let valElem;
            if (itemData.template && typeof itemData.template.create === 'string') {
                valElem = getValue(itemData.template.create, window)();
            }
            else if (itemData.template && itemData.template.create) {
                valElem = itemData.template.create();
            }
            if (valElem instanceof Element) {
                valElem.id = parentId + '_valuekey0';
                addClass([valElem], 'e-template');
                addClass([valElem], 'e-' + itemData.field);
                target.nextElementSibling.appendChild(valElem);
            }
            else if (valElem instanceof Array) {
                addClass(valElem, 'e-template');
                for (let i = 0, iLen = valElem.length; i < iLen; i++) {
                    valElem[i].id = parentId + '_valuekey' + i;
                    target.nextElementSibling.appendChild(valElem[i]);
                }
            }
            let parentElem = target.parentElement.querySelector('.e-rule-value');
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                parentElem.style.width = '100%';
            }
            else {
                parentElem.style.minWidth = '200px';
            }
        }
        else {
            if (tempRule.type === 'boolean' || tempRule.operator && tempRule.operator.toLowerCase().indexOf('between') > -1) {
                for (let i = 0; i < 2; i++) {
                    let valElem;
                    valElem = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey' + i } });
                    target.nextElementSibling.appendChild(valElem);
                }
            }
            else {
                let valElem = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey0' } });
                target.nextElementSibling.appendChild(valElem);
            }
        }
        this.renderControls(target, itemData, rule, tempRule);
    }
    updateValues(element, rule) {
        let controlName = element.className.split(' e-')[1];
        let i = parseInt(element.id.slice(-1), 2);
        switch (controlName) {
            case 'textbox':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'dropdownlist':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'radio':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'numerictextbox':
                if (rule.operator.indexOf('between') > -1) {
                    rule.value[i] = getComponent(element, controlName).value;
                }
                else {
                    rule.value = getComponent(element, controlName).value;
                }
                break;
            case 'datepicker':
                let column = this.getColumn(rule.field);
                let format = { type: 'dateTime', format: column.format || 'MM/dd/yyyy' };
                if (rule.operator.indexOf('between') > -1) {
                    rule.value[i] = getComponent(element, controlName).value;
                }
                else {
                    rule.value = this.intl.formatDate(getComponent(element, controlName).value, format);
                }
                break;
        }
    }
    updateRules(target, selectedValue, i) {
        let groupElem = closest(target, '.e-group-container');
        let rule = this.getGroup(groupElem);
        let ruleElem = closest(target, '.e-rule-container');
        let index = 0;
        let dropDownObj;
        let eventsArgs;
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        ruleElem = closest(target, '.e-rule-container');
        if (closest(target, '.e-rule-filter')) {
            dropDownObj = getComponent(target, 'dropdownlist');
            rule.rules[index].field = this.columns[dropDownObj.index].field;
            rule.rules[index].type = this.columns[dropDownObj.index].type;
            rule.rules[index].label = this.columns[dropDownObj.index].label;
            let ruleElement = closest(target, '.e-rule-filter');
            let element = ruleElement.nextElementSibling.querySelector('input.e-control');
            let operator = getComponent(element, 'dropdownlist').value;
            rule.rules[index].operator = operator;
            element = ruleElement.nextElementSibling.nextElementSibling.querySelector('input.e-control');
            if (!element) {
                element = ruleElement.nextElementSibling.nextElementSibling.querySelector('div.e-control');
            }
            eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, selectedItem: selectedValue, cancel: false };
            this.updateValues(element, rule.rules[index]);
            this.trigger('fieldChanged', eventsArgs);
            if (this.allowValidation && rule.rules[index].field && target.parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(target.parentElement, 'tooltip').destroy();
            }
        }
        else if (closest(target, '.e-rule-operator')) {
            dropDownObj = getComponent(target, 'dropdownlist');
            rule.rules[index].operator = dropDownObj.value;
            let inputElem;
            let parentElem = target.parentElement;
            inputElem = ruleElem.querySelectorAll('.e-rule-value input.e-control');
            eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, selectedItem: selectedValue, cancel: false };
            if (this.allowValidation && rule.rules[index].operator && target.parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(target.parentElement, 'tooltip').destroy();
            }
            if (inputElem.length > 1) {
                rule.rules[index].value = [];
            }
            for (let i = 0; i < inputElem.length; i++) {
                this.updateValues(inputElem[i], rule.rules[index]);
            }
            this.trigger('operatorChanged', eventsArgs);
        }
        else if (closest(target, '.e-rule-value')) {
            this.ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i);
        }
    }
    ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i) {
        let eventsArgs;
        let arrOperator = ['in', 'between'];
        if (selectedValue !== null) {
            let oper = rule.rules[index].operator.toLowerCase();
            if (target.className.indexOf('e-multiselect') > -1 && rule.rules[index].type === 'number') {
                let selVal = [];
                let dupSelectedValue = selectedValue;
                for (let k = 0, kLen = dupSelectedValue.length; k < kLen; k++) {
                    if (typeof dupSelectedValue[k] === 'string') {
                        selVal.push(parseFloat(dupSelectedValue[k]));
                    }
                }
                if (selVal.length) {
                    selectedValue = selVal;
                }
            }
            if (target.className.indexOf('e-template') > -1) {
                if (selectedValue instanceof Array) {
                    if (arrOperator.indexOf(oper) > -1) {
                        rule.rules[index].value = selectedValue;
                    }
                    else {
                        rule.rules[index].value = selectedValue[0];
                    }
                }
                else {
                    rule.rules[index].value = selectedValue;
                }
                eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, selectedItem: selectedValue, cancel: false };
                this.trigger('valueChanged', eventsArgs);
            }
            else if (target.className.indexOf('e-spin') > -1 || target.className.indexOf('e-numeric') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    rule.rules[index].value[i] = selectedValue;
                }
                else {
                    rule.rules[index].value = selectedValue;
                }
            }
            else if (target.className.indexOf('e-radio') > -1) {
                rule.rules[index].value = selectedValue;
            }
            else if (target.className.indexOf('e-multiselect') > -1) {
                rule.rules[index].value = selectedValue;
            }
            else if (target.className.indexOf('e-textbox') > -1) {
                if (oper === 'in' || oper === 'notin') {
                    if (rule.rules[index].type === 'string') {
                        rule.rules[index].value = this.processValueString(selectedValue, rule.rules[index].type);
                    }
                    else {
                        rule.rules[index].value = this.processValueString(selectedValue, rule.rules[index].type);
                    }
                }
                else {
                    rule.rules[index].value = selectedValue;
                }
            }
            else if (target.className.indexOf('e-datepicker') > -1) {
                let ddlInst = getInstance(ruleElem.querySelector('.e-rule-filter input'), DropDownList);
                let format = { type: 'dateTime', format: this.columns[ddlInst.index].format || 'MM/dd/yyyy' };
                if (format.type) {
                    if (arrOperator.indexOf(oper) > -1) {
                        rule.rules[index].value[i] = this.intl.formatDate(selectedValue, format);
                    }
                    else {
                        rule.rules[index].value = this.intl.formatDate(selectedValue, format);
                    }
                }
            }
            this.validatValue(rule, index, ruleElem);
        }
    }
    validatValue(rule, index, ruleElem) {
        if (this.allowValidation && rule.rules[index].value) {
            let valElem = ruleElem.querySelectorAll('.e-rule-value .e-control');
            if (valElem[0].className.indexOf('e-tooltip') > -1) {
                getComponent(valElem[0], 'tooltip').destroy();
            }
            else if (valElem[0].parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(valElem[0].parentElement, 'tooltip').destroy();
            }
            if (valElem[1] && valElem[1].parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(valElem[1].parentElement, 'tooltip').destroy();
            }
        }
    }
    findGroupByIdx(groupIdx, rule, isRoot) {
        let ruleColl = rule.rules;
        if (!isRoot && ruleColl[groupIdx]) {
            rule = ruleColl[groupIdx];
            if (rule.rules) {
                return rule;
            }
            else {
                for (let j = groupIdx + 1, jLen = ruleColl.length; j < jLen; j++) {
                    rule = ruleColl[j];
                    if (rule.rules) {
                        return rule;
                    }
                }
            }
        }
        return rule;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy() {
        let queryElement = this.element;
        if (!queryElement) {
            return;
        }
        let element;
        let i;
        let len;
        super.destroy();
        element = this.element.querySelectorAll('.e-addrulegroup');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdown-btn').destroy();
            detach(element[i]);
        }
        element = this.element.querySelectorAll('.e-rule-filter .e-control');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdownlist').destroy();
            detach(element[i]);
        }
        element = this.element.querySelectorAll('.e-rule-operator .e-control');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdownlist').destroy();
            detach(element[i]);
        }
        this.isImportRules = false;
        this.unWireEvents();
        this.levelColl[this.element.id + '_e_group0'] = [0];
        this.rule = { condition: 'and', rules: [] };
        this.element.innerHTML = '';
        classList(this.element, [], ['e-rtl', 'e-responsive', 'e-device']);
    }
    /**
     * Adds single or multiple rules.
     * @returns void.
     */
    addRules(rule, groupID) {
        let args = { groupID: groupID };
        for (let i = 0, len = rule.length; i < len; i++) {
            this.addRuleElement(document.getElementById(groupID), rule[i]);
        }
        this.trigger('ruleInsert', args);
    }
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    addGroups(groups, groupID) {
        let groupElem = document.getElementById(groupID);
        let rule = this.getGroup(groupElem);
        let grouplen = groups.length;
        let args = { groupID: groupID };
        if (grouplen) {
            for (let i = 0, len = groups.length; i < len; i++) {
                this.importRules(groups[i], groupElem);
            }
        }
        else {
            rule.rules.push({ 'condition': 'and', rules: [] });
        }
        this.trigger('groupInsert', args);
    }
    initWrapper() {
        if (this.cssClass) {
            addClass([this.element], this.cssClass);
        }
        if (this.enableRtl) {
            addClass([this.element], 'e-rtl');
        }
        if (this.width) {
            this.element.style.width = this.width;
        }
        if (this.height) {
            this.element.style.height = this.height;
        }
        if (this.rule.rules.length) {
            this.isImportRules = true;
        }
        else {
            this.addGroupElement(false, this.element);
        }
        if (Browser.isDevice || this.displayMode === 'Vertical') {
            if (Browser.isDevice) {
                this.element.style.width = '100%';
                this.element.classList.add('e-device');
            }
            removeClass(document.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
            addClass(document.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
            this.displayMode = 'Vertical';
        }
        else {
            this.displayMode = 'Horizontal';
        }
        if (this.isImportRules && this.summaryView) {
            this.renderSummary();
        }
        else {
            if (this.columns.length && this.isImportRules) {
                this.addGroupElement(false, this.element, this.rule.condition);
                let mRules = extend({}, this.rule, {}, true);
                this.setGroupRules(mRules);
            }
            else if (this.columns.length) {
                this.addRuleElement(this.element.querySelector('.e-group-container'), {});
            }
            let buttons = document.querySelectorAll('label.e-btn');
            let button;
            for (let i = 0; i < buttons.length; i++) {
                button = buttons.item(i);
                rippleEffect(button, { selector: '.e-btn' });
            }
        }
    }
    renderSummary() {
        let contentElem = this.createElement('div', {
            attrs: {
                class: 'e-summary-content',
                id: this.element.id + '_summary_content'
            }
        });
        let textElem = this.createElement('textarea', { attrs: { class: 'e-summary-text', readonly: 'true' }, styles: 'max-height:500px' });
        let editElem = this.createElement('button', { attrs: { class: 'e-edit-rule e-css e-btn e-small e-flat e-primary' } });
        let divElem = this.createElement('div', { attrs: { class: 'e-summary-btndiv' } });
        contentElem.appendChild(textElem);
        textElem.textContent = this.getSqlFromRules(this.rule);
        editElem.textContent = this.l10n.getConstant('Edit');
        divElem.appendChild(editElem);
        contentElem.appendChild(divElem);
        this.element.appendChild(contentElem);
    }
    renderSummaryCollapse() {
        let collapseElem = this.createElement('div', {
            attrs: {
                class: 'e-collapse-rule e-icons',
                title: this.l10n.getConstant('SummaryViewTitle')
            }
        });
        this.element.querySelector('.e-group-header').appendChild(collapseElem);
    }
    columnSort() {
        if (this.sortDirection.toLowerCase() === 'descending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortByDesc('field'));
        }
        else if (this.sortDirection.toLowerCase() === 'ascending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortBy('field'));
        }
    }
    onPropertyChanged(newProp, oldProp) {
        let properties = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
                case 'summaryView':
                    let groupElem = this.element.querySelector('.e-group-container');
                    let summaryElem = this.element.querySelector('.e-summary-content');
                    if (newProp.summaryView) {
                        groupElem.style.display = 'none';
                        if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                            this.renderSummary();
                            summaryElem = this.element.querySelector('.e-summary-content');
                        }
                        else {
                            this.element.querySelector('.e-summary-text').textContent = this.getSqlFromRules(this.rule);
                        }
                        summaryElem.style.display = 'block';
                    }
                    else {
                        if (groupElem.querySelectorAll('.e-collapse-rule').length > -1) {
                            this.renderSummaryCollapse();
                        }
                        groupElem.style.display = 'block';
                        summaryElem.style.display = 'none';
                    }
                    break;
                case 'displayMode':
                    if (newProp.displayMode === 'Horizontal') {
                        addClass(this.element.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
                        removeClass(this.element.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
                    }
                    else {
                        addClass(this.element.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
                        removeClass(this.element.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
                    }
                    break;
                case 'showButtons':
                    if (newProp.showButtons.ruleDelete) {
                        removeClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    }
                    else {
                        addClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    }
                    if (newProp.showButtons.groupDelete) {
                        removeClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    }
                    else {
                        addClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        addClass([this.element], 'e-rtl');
                    }
                    else {
                        removeClass([this.element], 'e-rtl');
                    }
                    break;
                case 'enablePersistence':
                    this.enablePersistence = newProp.enablePersistence;
                    break;
                case 'dataSource':
                    this.dataSource = newProp.dataSource;
                    break;
                case 'columns':
                    this.columns = newProp.columns;
                    this.columnSort();
                    break;
                case 'sortDirection':
                    this.sortDirection = newProp.sortDirection;
                    this.columnSort();
                    break;
                case 'maxGroupCount':
                    this.maxGroupCount = newProp.maxGroupCount;
                    break;
                case 'height':
                    this.height = newProp.height;
                    this.element.style.height = this.height;
                    break;
                case 'rule':
                    this.rule = newProp.rule;
                    break;
                case 'width':
                    this.width = newProp.width;
                    this.element.style.width = this.width;
                    break;
                case 'locale':
                    this.locale = newProp.locale;
                    break;
            }
        }
    }
    preRender() {
        this.defaultLocale = {
            StartsWith: 'Starts With',
            EndsWith: 'Ends With',
            Contains: 'Contains',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            Between: 'Between',
            NotBetween: 'Not Between',
            In: 'In',
            NotIn: 'Not In',
            Remove: 'REMOVE',
            SelectField: 'Select a field',
            SelectOperator: 'Select operator',
            DeleteRule: 'Remove this condition',
            DeleteGroup: 'Delete group',
            AddGroup: 'Add Group',
            AddCondition: 'Add Condition',
            Edit: 'EDIT',
            ValidationMessage: 'This field is required',
            SummaryViewTitle: 'Summary View'
        };
        this.l10n = new L10n('querybuilder', this.defaultLocale, this.locale);
        this.intl = new Internationalization();
        this.groupIdCounter = 0;
        this.ruleIdCounter = 0;
        this.btnGroupId = 0;
        this.isImportRules = false;
        this.parser = [];
        this.customOperators = {
            stringOperator: [
                { value: 'startswith', key: this.l10n.getConstant('StartsWith') },
                { value: 'endswith', key: this.l10n.getConstant('EndsWith') },
                { value: 'contains', key: this.l10n.getConstant('Contains') },
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') }
            ],
            dateOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }
            ],
            booleanOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }
            ],
            numberOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'between', key: this.l10n.getConstant('Between') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'notbetween', key: this.l10n.getConstant('NotBetween') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') }
            ],
        };
        this.operators = {
            equal: '=', notequal: '!=', greaterthan: '>', greaterthanorequal: '>=', lessthan: '<', in: 'IN', notin: 'NOT IN',
            lessthanorequal: '<=', startswith: 'LIKE', endswith: 'LIKE', between: 'BETWEEN', notbetween: 'NOT BETWEEN', contains: 'LIKE'
        };
        this.operatorValue = {
            equal: 'Equal', greaterthan: 'GreaterThan', greaterthanorequal: 'GreaterThanOrEqual',
            lessthan: 'LessThan', lessthanorequal: 'LessThanOrEqual', notequal: 'NotEqual',
            between: 'Between', in: 'in', notin: 'NotIn', notbetween: 'NotBetween', startswith: 'StartsWith', endswith: 'EndsWith',
            contains: 'Contains'
        };
    }
    render() {
        this.levelColl = {};
        this.items = [
            {
                text: this.l10n.getConstant('AddGroup'),
                iconCss: 'e-icons e-add-icon e-addgroup'
            },
            {
                text: this.l10n.getConstant('AddCondition'),
                iconCss: 'e-icons e-add-icon e-addrule',
            }
        ];
        this.ruleElem = this.ruleTemplate();
        this.groupElem = this.groupTemplate();
        if (this.dataSource instanceof DataManager) {
            this.dataManager = this.dataSource;
            this.executeDataManager(new Query());
        }
        else {
            this.dataManager = new DataManager(this.dataSource);
            this.dataColl = this.dataManager.executeLocal(new Query());
            this.initControl();
        }
    }
    executeDataManager(query) {
        let data = this.dataManager.executeQuery(query);
        let deferred = new Deferred();
        data.then((e) => {
            this.dataColl = e.result;
            this.initControl();
        }).catch((e) => {
            deferred.reject(e);
        });
    }
    initControl() {
        this.initialize();
        this.initWrapper();
        this.wireEvents();
    }
    wireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.add(wrapper, 'click', this.clickEventHandler, this);
    }
    unWireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.remove(wrapper, 'click', this.clickEventHandler);
    }
    getGroup(target, isParent) {
        let groupLevel = this.levelColl[target.id];
        let len = isParent ? groupLevel.length - 1 : groupLevel.length;
        let rule = this.rule;
        for (let i = 0; i < len; i++) {
            rule = this.findGroupByIdx(groupLevel[i], rule, i === 0);
        }
        return rule;
    }
    deleteGroup(target) {
        let groupElem = target;
        let groupId = groupElem.id;
        let rule = this.getGroup(groupElem, true);
        let index = 0;
        let i;
        let len;
        let args = { groupID: groupId };
        this.trigger('groupDelete', args);
        let nextElem = groupElem.nextElementSibling;
        let prevElem = groupElem.previousElementSibling;
        let element = groupElem.querySelectorAll('.e-group-container');
        let valElem = target.querySelectorAll('.e-tooltip');
        len = valElem.length;
        for (i = 0; i < len; i++) {
            getComponent(valElem[i], 'tooltip').destroy();
        }
        for (i = 0, len = element.length; i < len; i++) {
            delete this.levelColl[element[i].id];
        }
        while (groupElem.previousElementSibling !== null) {
            groupElem = groupElem.previousElementSibling;
            index++;
        }
        if (nextElem && nextElem.className.indexOf('e-separate-rule') > -1) {
            removeClass([nextElem], 'e-separate-rule');
            addClass([nextElem], 'e-joined-rule');
            if (prevElem && prevElem.className.indexOf('e-rule-container') > -1) {
                addClass([prevElem], 'e-prev-joined-rule');
            }
        }
        rule.rules.splice(index, 1);
        delete this.levelColl[groupId];
        detach(target);
    }
    deleteRule(target) {
        let groupElem = closest(target, '.e-group-container');
        let rule = this.getGroup(groupElem);
        let ruleElem = closest(target, '.e-rule-container');
        let clnruleElem = ruleElem;
        let nextElem = ruleElem.nextElementSibling;
        let prevElem = ruleElem.previousElementSibling;
        let args = { groupID: groupElem.id, ruleID: ruleElem.id };
        let index = 0;
        let valElem = ruleElem.querySelectorAll('.e-tooltip');
        let i;
        let len = valElem.length;
        for (i = 0; i < len; i++) {
            getComponent(valElem[i], 'tooltip').destroy();
        }
        while (ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        rule.rules.splice(index, 1);
        this.trigger('ruleDelete', args);
        if (!prevElem || prevElem.className.indexOf('e-rule-container') < 0) {
            if (nextElem) {
                removeClass([nextElem], 'e-joined-rule');
            }
        }
        if (!nextElem || nextElem.className.indexOf('e-rule-container') < 0) {
            if (prevElem) {
                removeClass([prevElem], 'e-prev-joined-rule');
            }
        }
        detach(clnruleElem);
    }
    setGroupRules(rule) {
        this.reset();
        this.groupIdCounter = 1;
        this.ruleIdCounter = 0;
        this.isImportRules = true;
        this.rule = rule;
        this.importRules(this.rule, this.element.querySelector('.e-group-container'), true);
        this.isImportRules = false;
    }
    /**
     * Set the rule or rules collection.
     * @returns void.
     */
    setRules(rule) {
        let mRules = extend({}, rule, {}, true);
        this.setGroupRules(mRules);
    }
    /**
     * Gets the rule or rule collection.
     * @returns object.
     */
    getRules() {
        return this.rule;
    }
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    deleteGroups(groupID) {
        let i;
        let len = groupID.length;
        for (i = 0; i < len; i++) {
            this.deleteGroup(document.getElementById(groupID[i]));
        }
    }
    /**
     * Gets the predicate from collection of rules.
     * @returns object.
     */
    getFilteredRecords() {
        let query = new Query().where(this.getPredicate(this.rule));
        return new DataManager(this.dataSource).executeLocal(query);
    }
    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    deleteRules(ruleID) {
        let i;
        let len = ruleID.length;
        for (i = 0; i < len; i++) {
            this.deleteRule(document.getElementById(ruleID[i]));
        }
    }
    /**
     * Gets the query for Data Manager.
     * @returns string.
     */
    getDataManagerQuery(rule) {
        let predicate = this.getPredicate(rule);
        let query;
        let fields = [];
        for (let i = 0, len = Object.keys(this.columns); i < len.length; i++) {
            fields.push(this.columns[i].field);
        }
        if (rule.rules.length) {
            query = new Query().select(fields).where(predicate);
        }
        else {
            query = new Query().select(fields);
        }
        return query;
    }
    /**
     * Get the predicate from collection of rules.
     * @returns null
     */
    getPredicate(rule) {
        let ruleColl = rule.rules;
        let pred;
        let pred2;
        let ruleValue;
        let matchCase = false;
        let column;
        for (let i = 0, len = ruleColl.length; i < len; i++) {
            let keys = Object.keys(ruleColl[i]);
            if (keys.indexOf('rules') > -1) {
                pred2 = this.getPredicate(ruleColl[i]);
                if (pred2) {
                    if (pred) {
                        if (rule.condition === 'and') {
                            pred = pred.and(pred2);
                        }
                        else {
                            pred = pred.or(pred2);
                        }
                    }
                    else {
                        pred = pred2;
                    }
                }
            }
            else if (ruleColl[i].operator.length) {
                let oper = ruleColl[i].operator.toLowerCase();
                let strOperColl = ['contains', 'startswith', 'endswith'];
                let dateOperColl = ['equal', 'notequal'];
                matchCase = (strOperColl.indexOf(oper) > -1 || (ruleColl[i].type === 'date' && dateOperColl.indexOf(oper) > -1));
                column = this.getColumn(ruleColl[i].field);
                if (ruleColl[i].type === 'date') {
                    let format = { type: 'dateTime', format: column.format || 'MM/dd/yyyy' };
                    ruleValue = this.intl.parseDate(ruleColl[i].value, format);
                }
                else {
                    ruleValue = ruleColl[i].value;
                }
                if (i === 0) {
                    if ((oper.indexOf('in') > -1 || oper.indexOf('between') > -1) && oper !== 'contains') {
                        pred = this.arrayPredicate(ruleColl[i]);
                    }
                    else {
                        let value = ruleValue;
                        if (value !== '') {
                            pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, matchCase);
                        }
                    }
                }
                else {
                    if (rule.condition === 'and') {
                        if ((oper.indexOf('in') > -1 || oper.indexOf('between') > -1) && oper !== 'contains') {
                            pred = this.arrayPredicate(ruleColl[i], pred, rule.condition);
                        }
                        else {
                            let value = ruleValue;
                            if (pred && value !== '') {
                                pred = pred.and(ruleColl[i].field, ruleColl[i].operator, ruleValue, matchCase);
                            }
                            else if (value !== '') {
                                pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, matchCase);
                            }
                        }
                    }
                    else {
                        if ((oper.indexOf('in') > -1 || oper.indexOf('between') > -1) && oper !== 'contains') {
                            pred = this.arrayPredicate(ruleColl[i], pred, rule.condition);
                        }
                        else {
                            let value = ruleValue;
                            if (pred && value !== '') {
                                pred = pred.or(ruleColl[i].field, ruleColl[i].operator, ruleValue, matchCase);
                            }
                            else if (value !== '') {
                                pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, matchCase);
                            }
                        }
                    }
                }
            }
        }
        return pred;
    }
    getColumn(field) {
        let columns = this.columns;
        let column;
        for (let i = 0, iLen = columns.length; i < iLen; i++) {
            if (columns[i].field === field) {
                column = columns[i];
            }
        }
        return column;
    }
    arrayPredicate(ruleColl, predicate, condition) {
        let value = ruleColl.value;
        let pred;
        for (let j = 0, jLen = value.length; j < jLen; j++) {
            if (value[j] !== '') {
                if (j === 0) {
                    switch (ruleColl.operator) {
                        case 'between':
                            pred = new Predicate(ruleColl.field, 'greaterthan', value[j]);
                            break;
                        case 'notbetween':
                            pred = new Predicate(ruleColl.field, 'lessthan', value[j]);
                            break;
                        case 'in':
                            pred = new Predicate(ruleColl.field, 'equal', value[j]);
                            break;
                        case 'notin':
                            pred = new Predicate(ruleColl.field, 'notequal', value[j]);
                            break;
                    }
                }
                else {
                    switch (ruleColl.operator) {
                        case 'between':
                            pred = pred.and(ruleColl.field, 'lessthan', value[j]);
                            break;
                        case 'notbetween':
                            pred = pred.or(ruleColl.field, 'greaterthan', value[j]);
                            break;
                        case 'in':
                            pred = pred.or(ruleColl.field, 'equal', value[j]);
                            break;
                        case 'notin':
                            pred = pred.and(ruleColl.field, 'notequal', value[j]);
                            break;
                    }
                }
            }
        }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                }
                else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            }
            else {
                predicate = pred;
            }
        }
        return predicate;
    }
    importRules(rule, parentElem, isReset) {
        if (!isReset) {
            parentElem = this.renderGroup(rule.condition, parentElem);
        }
        let ruleColl = rule.rules;
        for (let i = 0, len = ruleColl.length; i < len; i++) {
            let keys = Object.keys(ruleColl[i]);
            if (keys.indexOf('rules') > -1) {
                parentElem = this.renderGroup(ruleColl[i].condition, parentElem);
                parentElem = this.importRules(ruleColl[i], parentElem, true);
            }
            else {
                this.renderRule(ruleColl[i], parentElem);
            }
        }
        parentElem = closest(parentElem, '.e-rule-list');
        if (parentElem) {
            parentElem = closest(parentElem, '.e-group-container');
        }
        return parentElem;
    }
    renderGroup(condition, parentElem) {
        this.addGroupElement(true, parentElem, condition); //Child group
        let element = parentElem.querySelectorAll('.e-group-container');
        return element[element.length - 1];
    }
    renderRule(rule, parentElem) {
        if (parentElem.className.indexOf('e-group-container') > -1) {
            this.addRuleElement(parentElem, rule); //Create rule
        }
        else {
            this.addRuleElement(parentElem.querySelector('.e-group-container'), rule); //Create group
        }
    }
    getSqlString(rules, queryStr) {
        let isRoot = false;
        if (!queryStr) {
            queryStr = '';
            isRoot = true;
        }
        else {
            queryStr += '(';
        }
        let condition = rules.condition;
        for (let j = 0, jLen = rules.rules.length; j < jLen; j++) {
            if (rules.rules[j].rules) {
                queryStr = this.getSqlString(rules.rules[j], queryStr);
            }
            else {
                let rule = rules.rules[j];
                let valueStr = '';
                if (rule.value instanceof Array) {
                    if (typeof rule.value[0] === 'string') {
                        valueStr += '("' + rule.value[0] + '"';
                        for (let k = 1, kLen = rule.value.length; k < kLen; k++) {
                            valueStr += ',"' + rule.value[k] + '"';
                        }
                        valueStr += ')';
                    }
                    else {
                        valueStr += '(' + rule.value + ')';
                    }
                }
                else {
                    if (rule.operator === 'startswith') {
                        valueStr += '("' + rule.value + '%")';
                    }
                    else if (rule.operator === 'endswith') {
                        valueStr += '("%' + rule.value + '")';
                    }
                    else if (rule.operator === 'contains') {
                        valueStr += '("%' + rule.value + '%")';
                    }
                    else {
                        if (rule.type === 'number') {
                            valueStr += rule.value;
                        }
                        else {
                            valueStr += '"' + rule.value + '"';
                        }
                    }
                }
                queryStr += rule.field + ' ' + this.operators[rule.operator] + ' ' + valueStr;
            }
            if (j !== jLen - 1) {
                queryStr += ' ' + condition + ' ';
            }
        }
        if (!isRoot) {
            queryStr += ')';
        }
        return queryStr;
    }
    /**
     * Sets the rules from the sql query.
     */
    setRulesFromSql(sqlString) {
        let ruleModel = this.getRulesFromSql(sqlString);
        this.setRules({ condition: ruleModel.condition, rules: ruleModel.rules });
    }
    /**
     * Get the rules from SQL query.
     * @returns object.
     */
    getRulesFromSql(sqlString) {
        this.parser = [];
        this.sqlParser(sqlString);
        this.rule = { condition: '', rules: [] };
        return this.processParser(this.parser, this.rule, [0]);
    }
    /**
     * Gets the sql query from rules.
     * @returns object.
     */
    getSqlFromRules(rule) {
        return this.getSqlString(rule).replace(/"/g, '\'');
    }
    sqlParser(sqlString) {
        let st = 0;
        let str;
        do {
            str = sqlString.slice(st);
            st += this.parseSqlStrings(str);
        } while (str !== '');
        return this.parser;
    }
    parseSqlStrings(sqlString) {
        let operators = ['=', '!=', '<', '>', '<=', '>='];
        let conditions = ['and', 'or'];
        let subOp = ['IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'BETWEEN', 'NOT BETWEEN'];
        let regexStr;
        let regex;
        let matchValue;
        for (let i = 0, iLen = operators.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(operators[i]) ? '\\b' : '';
            regex = new RegExp('^(' + operators[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Operators', operators[i].toLowerCase()]);
                return operators[i].length;
            }
        }
        for (let i = 0, iLen = conditions.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(conditions[i]) ? '\\b' : '';
            regex = new RegExp('^(' + conditions[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Conditions', conditions[i].toLowerCase()]);
                return conditions[i].length;
            }
        }
        for (let i = 0, iLen = subOp.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(subOp[i]) ? '\\b' : '';
            regex = new RegExp('^(' + subOp[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['SubOperators', subOp[i].toLowerCase()]);
                return subOp[i].length;
            }
        }
        //Left Parenthesis
        if (/^\(/.exec(sqlString)) {
            this.parser.push(['Left', '(']);
            return 1;
        }
        //Right Parenthesis
        if (/^\)/.exec(sqlString)) {
            this.parser.push(['Right', ')']);
            return 1;
        }
        //Literals
        if (/^`?([a-z_][a-z0-9_]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)) {
            matchValue = /^`?([a-z_][a-z0-9_]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)[1];
            this.parser.push(['Literal', matchValue]);
            return matchValue.length;
        }
        //String
        if (/^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)) {
            matchValue = /^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)[0];
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        //Double String
        if (/^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)) {
            matchValue = /^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)[0];
            this.parser.push(['DoubleString', matchValue]);
            return matchValue.length;
        }
        //Number
        if (/^[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            matchValue = /^[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        return 1;
    }
    getOperator(value, operator) {
        let operators = {
            '=': 'equal', '!=': 'notequal', '<': 'lessthan', '>': 'greaterthan', '<=': 'lessthanorequal',
            '>=': 'greaterthanorequal', 'in': 'in', 'not in': 'notin', 'between': 'between', 'not between': 'notbetween'
        };
        if (value.indexOf('%') === 0 && value.indexOf('%') === value.length - 1) {
            return 'contains';
        }
        else if (value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
            return 'startswith';
        }
        else if (value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
            return 'endswith';
        }
        return operators[operator];
    }
    processParser(parser, rules, levelColl) {
        let rule;
        let numVal = [];
        let strVal = [];
        let subRules;
        let j;
        let jLen;
        let k;
        let kLen;
        let l;
        let lLen;
        let grpCount;
        let operator;
        for (let i = 0, iLen = parser.length; i < iLen; i++) {
            if (parser[i][0] === 'Literal') {
                rule = { label: parser[i][1], field: parser[i][1] };
                if (parser[i + 1][0] === 'SubOperators') {
                    rule.operator = this.getOperator(parser[i + 3][1].replace(/'/g, ''), parser[i + 1][1]);
                    operator = parser[i + 1][1];
                    i++;
                    j = i + 1;
                    jLen = iLen;
                    for (j = i + 1; j < jLen; j++) {
                        if (parser[j][0] === 'Right') {
                            i = j;
                            break;
                        }
                        else {
                            if (operator === 'like' && parser[j][0] === 'String') {
                                rule.value = parser[j][1].replace(/'/g, '').replace(/%/g, '');
                                rule.type = 'string';
                            }
                            else {
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                }
                                else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                        }
                    }
                    if (operator !== 'like') {
                        if (parser[j - 1][0] === 'Number') {
                            rule.value = numVal;
                            rule.type = 'number';
                        }
                        else if (parser[j - 1][0] === 'String') {
                            rule.value = strVal;
                            rule.type = 'string';
                        }
                    }
                }
                else if (parser[i + 1][0] === 'Operators') {
                    rule.operator = this.getOperator(parser[i + 2][1], parser[i + 1][1]);
                    if (parser[i + 2][0] === 'Number') {
                        rule.type = 'number';
                        rule.value = Number(parser[i + 2][1]);
                    }
                    else {
                        rule.type = 'string';
                        rule.value = parser[i + 2][1].replace(/'/g, '');
                    }
                }
                rules.rules.push(rule);
            }
            else if (parser[i][0] === 'Left') {
                subRules = { condition: '', rules: [] };
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                grpCount = 0;
                //To get the group position
                kLen = rules.rules.length;
                for (k = 0; k < kLen; k++) {
                    if (rules.rules[k].rules) {
                        grpCount++;
                    }
                }
                levelColl.push(grpCount);
                rules.rules.push(subRules);
                subRules = this.processParser(this.parser, subRules, levelColl);
                return rules;
            }
            else if (parser[i][0] === 'Conditions') {
                rules.condition = parser[i][1];
            }
            else if (parser[i][0] === 'Right') {
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                //To get the parent Group
                levelColl.pop();
                rules = this.rule;
                lLen = levelColl.length;
                for (l = 0; l < lLen; l++) {
                    rules = this.findGroupByIdx(levelColl[l], rules, l === 0);
                }
                return this.processParser(this.parser, rules, levelColl);
            }
        }
        return rules;
    }
};
__decorate([
    Event()
], QueryBuilder.prototype, "created", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "beforeConditionChange", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "beforeFieldChange", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "beforeOperatorChange", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "beforeValueChange", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "conditionChanged", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "fieldChanged", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "valueChanged", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "operatorChanged", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "groupDelete", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "ruleDelete", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "groupInsert", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "ruleInsert", void 0);
__decorate([
    Property({ ruleDelete: true, groupInsert: true, groupDelete: true })
], QueryBuilder.prototype, "showButtons", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "summaryView", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "allowValidation", void 0);
__decorate([
    Property([])
], QueryBuilder.prototype, "columns", void 0);
__decorate([
    Property('')
], QueryBuilder.prototype, "cssClass", void 0);
__decorate([
    Property([])
], QueryBuilder.prototype, "dataSource", void 0);
__decorate([
    Property('Horizontal')
], QueryBuilder.prototype, "displayMode", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "enableRtl", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "enablePersistence", void 0);
__decorate([
    Property('Default')
], QueryBuilder.prototype, "sortDirection", void 0);
__decorate([
    Property(5)
], QueryBuilder.prototype, "maxGroupCount", void 0);
__decorate([
    Property('auto')
], QueryBuilder.prototype, "height", void 0);
__decorate([
    Property('auto')
], QueryBuilder.prototype, "width", void 0);
__decorate([
    Complex({ condition: 'and', rules: [] }, Rule)
], QueryBuilder.prototype, "rule", void 0);
QueryBuilder = __decorate([
    NotifyPropertyChanges
], QueryBuilder);

/**
 * QueryBuilder modules
 */

/**
 * QueryBuilder all modules
 */

export { Columns, Rules, Rule, ShowButtons, QueryBuilder };
//# sourceMappingURL=ej2-querybuilder.es2015.js.map
