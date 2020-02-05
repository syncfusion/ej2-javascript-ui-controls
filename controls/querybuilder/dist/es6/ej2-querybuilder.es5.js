import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, addClass, classList, cldrData, closest, detach, extend, getComponent, getInstance, getValue, isBlazor, isNullOrUndefined, removeClass, rippleEffect } from '@syncfusion/ej2-base';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { CheckBoxSelection, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { DataManager, Deferred, Predicate, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Query Builder Source
 */
MultiSelect.Inject(CheckBoxSelection);
var Columns = /** @__PURE__ @class */ (function (_super) {
    __extends(Columns, _super);
    function Columns() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    __decorate([
        Property(null)
    ], Columns.prototype, "value", void 0);
    __decorate([
        Property(null)
    ], Columns.prototype, "category", void 0);
    return Columns;
}(ChildProperty));
var Rule = /** @__PURE__ @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], Rule.prototype, "condition", void 0);
    __decorate([
        Collection([], Rule)
    ], Rule.prototype, "rules", void 0);
    __decorate([
        Property(null)
    ], Rule.prototype, "field", void 0);
    __decorate([
        Property(null)
    ], Rule.prototype, "label", void 0);
    __decorate([
        Property(null)
    ], Rule.prototype, "type", void 0);
    __decorate([
        Property(null)
    ], Rule.prototype, "operator", void 0);
    __decorate([
        Property(null)
    ], Rule.prototype, "value", void 0);
    __decorate([
        Property(false)
    ], Rule.prototype, "not", void 0);
    return Rule;
}(ChildProperty));
var ShowButtons = /** @__PURE__ @class */ (function (_super) {
    __extends(ShowButtons, _super);
    function ShowButtons() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ShowButtons;
}(ChildProperty));
var QueryBuilder = /** @__PURE__ @class */ (function (_super) {
    __extends(QueryBuilder, _super);
    function QueryBuilder(options, element) {
        return _super.call(this, options, element) || this;
    }
    QueryBuilder.prototype.getPersistData = function () {
        return this.addOnPersist(['rule']);
    };
    /**
     * Clears the rules without root rule.
     * @returns void.
     */
    QueryBuilder.prototype.reset = function () {
        this.isImportRules = false;
        var bodeElem = this.element.querySelector('.e-group-body');
        bodeElem.innerHTML = '';
        if (this.enableNotCondition) {
            removeClass(this.element.querySelectorAll('.e-qb-toggle'), 'e-active-toggle');
        }
        bodeElem.appendChild(this.createElement('div', { attrs: { class: 'e-rule-list' } }));
        this.levelColl[this.element.id + '_group0'] = [0];
        this.rule = { condition: 'and', not: false, rules: [] };
        this.disableRuleCondition(bodeElem.parentElement);
    };
    QueryBuilder.prototype.getWrapper = function () {
        return this.element;
    };
    QueryBuilder.prototype.getModuleName = function () {
        return 'query-builder';
    };
    QueryBuilder.prototype.initialize = function () {
        if (this.dataColl.length) {
            var columnKeys = Object.keys(this.dataColl[0]);
            var cols = [];
            var type = void 0;
            var groupBy = false;
            var isDate = false;
            var value = void 0;
            var validateObj = { isRequired: true, min: 0, max: Number.MAX_VALUE };
            if (this.columns.length) {
                this.columnSort();
                var columns = this.columns;
                for (var i = 0, len = columns.length; i < len; i++) {
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
                    if (columns[i].category) {
                        groupBy = true;
                    }
                    else {
                        columns[i].category = this.l10n.getConstant('OtherFields');
                    }
                }
                if (groupBy) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                }
            }
            else {
                for (var i = 0, len = columnKeys.length; i < len; i++) {
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
        else if (this.columns.length) {
            var columns = this.columns;
            for (var i = 0, len = columns.length; i < len; i++) {
                if (columns[i].category) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                }
                else {
                    columns[i].category = this.l10n.getConstant('OtherFields');
                }
            }
        }
    };
    QueryBuilder.prototype.clickEventHandler = function (event) {
        var _this = this;
        var target = event.target;
        var args;
        this.isImportRules = false;
        var groupID;
        if (target.tagName === 'SPAN') {
            target = target.parentElement;
        }
        if (target.className.indexOf('e-collapse-rule') > -1) {
            var animation = new Animation({ duration: 1000, delay: 0 });
            if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                this.renderSummary();
            }
            var summaryElem = document.getElementById(this.element.id + '_summary_content');
            var txtareaElem = summaryElem.querySelector('.e-summary-text');
            animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
            var groupElem = this.element.querySelector('.e-group-container');
            groupElem.style.display = 'none';
            txtareaElem.textContent = this.getSqlFromRules(this.rule);
            summaryElem.style.display = 'block';
            txtareaElem.style.height = txtareaElem.scrollHeight + 'px';
        }
        if (target.tagName === 'BUTTON' && target.className.indexOf('e-qb-toggle') < 0) {
            if (target.className.indexOf('e-removerule') > -1) {
                this.actionButton = target;
                this.deleteRule(target);
            }
            else if (target.className.indexOf('e-deletegroup') > -1) {
                this.actionButton = target;
                this.deleteGroup(closest(target, '.e-group-container'));
            }
            else if (target.className.indexOf('e-edit-rule') > -1) {
                var animation = new Animation({ duration: 1000, delay: 0 });
                animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
                document.getElementById(this.element.id + '_summary_content').style.display = 'none';
                if (this.element.querySelectorAll('.e-group-container').length < 1) {
                    this.addGroupElement(false, this.element, this.rule.condition);
                    var mRules = extend({}, this.rule, {}, true);
                    this.setGroupRules(mRules);
                    this.renderSummaryCollapse();
                }
                else {
                    var groupElem = this.element.querySelector('.e-group-container');
                    if (groupElem.querySelectorAll('.e-collapse-rule').length < 1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block';
                }
            }
        }
        else if ((target.tagName === 'LABEL' && target.parentElement.className.indexOf('e-btn-group') > -1) ||
            target.className.indexOf('e-qb-toggle') > -1) {
            var element = closest(target, '.e-group-container');
            var forIdValue = target.getAttribute('for');
            var targetValue = void 0;
            if (forIdValue) {
                targetValue = document.getElementById(forIdValue).getAttribute('value');
            }
            groupID = element.id.replace(this.element.id + '_', '');
            var ariaChecked = void 0;
            if (this.enableNotCondition) {
                if (target.className.indexOf('e-qb-toggle') > -1) {
                    var toggleElem = element.getElementsByClassName('e-qb-toggle')[0];
                    if (toggleElem.className.indexOf('e-active-toggle') > -1) {
                        removeClass([toggleElem], 'e-active-toggle');
                        ariaChecked = false;
                    }
                    else {
                        addClass([toggleElem], 'e-active-toggle');
                        ariaChecked = true;
                    }
                    targetValue = this.rule.condition;
                }
                else {
                    ariaChecked = this.rule.not;
                }
            }
            args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase() };
            if (this.enableNotCondition) {
                args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase(),
                    'not': ariaChecked };
            }
            if (!this.isImportRules) {
                this.trigger('beforeChange', args, function (observedChangeArgs) {
                    _this.beforeSuccessCallBack(observedChangeArgs, target);
                });
            }
            else {
                this.beforeSuccessCallBack(args, target);
            }
        }
    };
    QueryBuilder.prototype.beforeSuccessCallBack = function (args, target) {
        if (!args.cancel) {
            var element = closest(target, '.e-group-container');
            var groupID = element.id.replace(this.element.id + '_', '');
            var beforeRules = this.getValidRules(this.rule);
            var rule = this.getParentGroup(element);
            rule.condition = args.value;
            if (this.enableNotCondition) {
                rule.not = args.not;
            }
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, type: 'condition', value: rule.condition });
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'condition');
        }
    };
    QueryBuilder.prototype.selectBtn = function (target, event) {
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
    };
    QueryBuilder.prototype.addRuleElement = function (target, rule) {
        var _this = this;
        if (!target) {
            return;
        }
        var args = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertRule' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, function (observedChangeArgs) {
                _this.addRuleSuccessCallBack(observedChangeArgs, target, rule);
            });
        }
        else {
            this.isInitialLoad = false;
            this.addRuleSuccessCallBack(args, target, rule);
        }
    };
    QueryBuilder.prototype.addRuleSuccessCallBack = function (args, target, rule) {
        if (!args.cancel) {
            var ruleElem = this.ruleElem.cloneNode(true);
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleElem.className = 'e-rule-container e-vertical-mode';
            }
            else {
                ruleElem.className = 'e-rule-container e-horizontal-mode';
            }
            var groupLevel = void 0;
            var rules = void 0;
            var i = void 0;
            var len = void 0;
            var dropDownList = void 0;
            var ruleListElem = target.querySelector('.e-rule-list');
            var element = ruleElem.querySelector('button');
            var height = void 0;
            var ruleID = void 0;
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                element.textContent = this.l10n.getConstant('Remove');
                addClass([element], 'e-flat');
                addClass([element], 'e-primary');
            }
            else {
                addClass([element], 'e-round');
                addClass([element], 'e-icon-btn');
                var tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteRule') });
                tooltip.appendTo(element);
                element = this.createElement('span', { attrs: { class: 'e-btn-icon e-icons e-delete-icon' } });
                ruleElem.querySelector('button').appendChild(element);
            }
            ruleElem.setAttribute('id', target.id + '_rule' + this.ruleIdCounter);
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
                fields: this.fields,
                placeholder: this.l10n.getConstant('SelectField'),
                popupHeight: ((this.columns.length > 5) ? height : 'auto'),
                change: this.changeField.bind(this),
                value: rule ? rule.field : null
            });
            dropDownList.appendTo('#' + ruleElem.id + '_filterkey');
            groupLevel = this.levelColl[target.id];
            this.selectedColumn = dropDownList.getDataByValue(dropDownList.value);
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
            if (!this.isImportRules) {
                this.disableRuleCondition(target);
            }
            if (Object.keys(rule).length) {
                this.changeRule(rule, {
                    element: dropDownList.element,
                    itemData: this.selectedColumn
                });
            }
            ruleID = ruleElem.id.replace(this.element.id + '_', '');
            if (!this.isImportRules) {
                this.trigger('change', { groupID: target.id.replace(this.element.id + '_', ''), ruleID: ruleID, type: 'insertRule' });
            }
        }
    };
    QueryBuilder.prototype.renderToolTip = function (element) {
        var tooltip = new Tooltip({ content: this.l10n.getConstant('ValidationMessage'),
            position: 'BottomCenter', cssClass: 'e-querybuilder-error' });
        tooltip.appendTo(element);
        tooltip.open(element);
    };
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    QueryBuilder.prototype.validateFields = function () {
        var isValid = true;
        if (this.allowValidation) {
            var i = void 0;
            var len = void 0;
            var fieldElem = void 0;
            var indexElem = void 0;
            var valArray = [];
            var groupElem = void 0;
            var index = void 0;
            var dropDownObj = void 0;
            var tempElem = void 0;
            var rule = void 0;
            var ruleElemCln = this.element.querySelectorAll('.e-rule-container');
            var validateRule = void 0;
            for (i = 0, len = ruleElemCln.length; i < len; i++) {
                groupElem = closest(ruleElemCln[i], '.e-group-container');
                rule = this.getParentGroup(groupElem);
                index = 0;
                indexElem = tempElem = ruleElemCln[i];
                dropDownObj = getComponent(ruleElemCln[i].querySelector('.e-rule-field input.e-control'), 'dropdownlist');
                this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
                validateRule = !isNullOrUndefined(dropDownObj.index) && this.selectedColumn.validation;
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
                        var valElem = tempElem.querySelectorAll('.e-rule-value input.e-control');
                        isValid = false;
                        for (var j_1 = 0, jLen = valElem.length; j_1 < jLen; j_1++) {
                            var element = valElem[j_1];
                            var elem = void 0;
                            if (element.parentElement.className.indexOf('e-searcher') > -1) {
                                elem = closest(element, '.e-multi-select-wrapper');
                                if (elem.className.indexOf('e-tooltip') < 0) {
                                    this.renderToolTip(elem);
                                }
                            }
                            else if (valElem[j_1].parentElement.className.indexOf('e-tooltip') < 0) {
                                this.renderToolTip(valElem[j_1].parentElement);
                            }
                            j_1++;
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
    };
    QueryBuilder.prototype.refreshLevelColl = function () {
        this.levelColl = {};
        var groupElem = this.element.querySelector('.e-group-container');
        this.levelColl[groupElem.id] = [0];
        var obj = { groupElement: groupElem, level: [0] };
        this.refreshLevel(obj);
    };
    QueryBuilder.prototype.refreshLevel = function (obj) {
        var ruleList = obj.groupElement.querySelector('.e-rule-list').children;
        var childElem;
        var groupElem = obj.groupElement;
        var i;
        var iLen = ruleList.length;
        var groupCount = 0;
        for (i = 0; i < iLen; i++) {
            childElem = ruleList[i];
            if (childElem.className.indexOf('e-group-container') > -1) {
                obj.level.push(groupCount);
                this.levelColl[childElem.id] = obj.level.slice();
                groupCount++;
                obj.groupElement = childElem;
                obj = this.refreshLevel(obj);
            }
        }
        var ruleListElem = closest(groupElem, '.e-rule-list');
        obj.groupElement = ruleListElem ? closest(ruleListElem, '.e-group-container') : groupElem;
        obj.level = this.levelColl[obj.groupElement.id].slice();
        return obj;
    };
    QueryBuilder.prototype.groupTemplate = function () {
        var groupElem;
        var grpBodyElem;
        var groupHdrElem;
        var rulesElem;
        var glueElem;
        var inputElem;
        var labelElem;
        var grpActElem;
        var groupBtn;
        groupElem = this.createElement('div', { attrs: { class: 'e-group-container' } });
        groupHdrElem = this.createElement('div', { attrs: { class: 'e-group-header' } });
        grpBodyElem = this.createElement('div', { attrs: { class: 'e-group-body' } });
        rulesElem = this.createElement('div', { attrs: { class: 'e-rule-list' } });
        groupElem.appendChild(groupHdrElem);
        grpBodyElem.appendChild(rulesElem);
        groupElem.appendChild(grpBodyElem);
        // create button group in OR and AND process
        glueElem = this.createElement('div', { attrs: { class: 'e-btn-group' } });
        if (this.enableNotCondition) {
            inputElem = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' } });
            glueElem.appendChild(inputElem);
        }
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-and', value: 'AND' } });
        inputElem.setAttribute('checked', 'true');
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-btn e-btngroup-and-lbl e-small' },
            innerHTML: this.l10n.getConstant('AND') });
        glueElem.appendChild(labelElem);
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-or', value: 'OR' } });
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-btn e-btngroup-or-lbl e-small' },
            innerHTML: this.l10n.getConstant('OR') });
        glueElem.appendChild(labelElem);
        groupHdrElem.appendChild(glueElem);
        grpActElem = this.createElement('div', { attrs: { class: 'e-group-action' } });
        groupBtn = this.createElement('button', { attrs: { type: 'button', class: 'e-add-btn' } });
        grpActElem.appendChild(groupBtn);
        groupHdrElem.appendChild(grpActElem);
        return groupElem;
    };
    QueryBuilder.prototype.ruleTemplate = function () {
        var ruleElem;
        var filterElem;
        var tempElem;
        var delBtnElem;
        var fieldElem;
        var clsName;
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
    };
    QueryBuilder.prototype.addGroupElement = function (isGroup, target, condition, isBtnClick) {
        var _this = this;
        var args = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertGroup' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, function (observedChangeArgs) {
                _this.addGroupSuccess(observedChangeArgs, isGroup, target, condition, isBtnClick);
            });
        }
        else {
            this.isInitialLoad = false;
            this.addGroupSuccess(args, isGroup, target, condition, isBtnClick);
        }
    };
    QueryBuilder.prototype.addGroupSuccess = function (args, isGroup, eventTarget, condition, isBtnClick) {
        if (!args.cancel && (this.element.querySelectorAll('.e-group-container').length <= this.maxGroupCount)) {
            var target = eventTarget;
            var dltGroupBtn = void 0;
            var groupElem = this.groupElem.cloneNode(true);
            groupElem.setAttribute('id', this.element.id + '_group' + this.groupIdCounter);
            this.groupIdCounter++;
            var andInpElem = groupElem.querySelector('.e-btngroup-and');
            var orInpElem = groupElem.querySelector('.e-btngroup-or');
            var andLblElem = groupElem.querySelector('.e-btngroup-and-lbl');
            var orLblElem = groupElem.querySelector('.e-btngroup-or-lbl');
            var notElem = groupElem.querySelector('.e-qb-toggle');
            andInpElem.setAttribute('id', this.element.id + '_and' + this.btnGroupId);
            orInpElem.setAttribute('id', this.element.id + '_or' + this.btnGroupId);
            andInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
            orInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
            andLblElem.setAttribute('for', this.element.id + '_and' + this.btnGroupId);
            orLblElem.setAttribute('for', this.element.id + '_or' + this.btnGroupId);
            this.btnGroupId++;
            if (isGroup) {
                var clsName = this.showButtons.groupDelete ? 'e-deletegroup' : 'e-deletegroup e-button-hide';
                dltGroupBtn = this.createElement('button', { attrs: { class: clsName } });
                var button = new Button({ iconCss: 'e-icons e-delete-icon', cssClass: 'e-small e-round' });
                button.appendTo(dltGroupBtn);
                var tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteGroup') });
                tooltip.appendTo(dltGroupBtn);
                rippleEffect(dltGroupBtn, { selector: '.deletegroup' });
                groupElem.querySelector('.e-group-action').appendChild(dltGroupBtn);
                var ruleList = target.querySelector('.e-rule-list');
                var childElems = ruleList.children;
                var grpLen = 0;
                for (var j = 0, jLen = childElems.length; j < jLen; j++) {
                    if (childElems[j].className.indexOf('e-group-container') > -1) {
                        grpLen += 1;
                    }
                }
                ruleList.appendChild(groupElem);
                var level = this.levelColl[target.id].slice(0);
                level.push(grpLen);
                this.levelColl[groupElem.id] = level;
                if (!this.isImportRules) {
                    this.addGroups([], target.id.replace(this.element.id + '_', ''));
                    if (isBtnClick) {
                        this.addRuleElement(groupElem, {});
                    }
                }
            }
            else {
                target.appendChild(groupElem);
                this.levelColl[groupElem.id] = [0];
            }
            if (this.enableNotCondition) {
                var tglBtn = new Button({ content: this.l10n.getConstant('NOT'), cssClass: 'e-btn e-small' });
                tglBtn.appendTo(notElem);
                groupElem.querySelector('.e-btngroup-and-lbl').classList.add('e-not');
            }
            var groupBtn = groupElem.querySelector('.e-add-btn');
            var btnObj = new DropDownButton({
                items: this.items,
                cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                iconCss: 'e-icons e-add-icon',
                beforeOpen: this.selectBtn.bind(this, groupBtn),
                select: this.selectBtn.bind(this, groupBtn)
            });
            btnObj.appendTo(groupBtn);
            if (!this.isImportRules) {
                this.trigger('change', { groupID: target.id.replace(this.element.id + '_', ''), type: 'insertGroup' });
            }
        }
    };
    QueryBuilder.prototype.notifyChange = function (value, element) {
        var tempColl = closest(element, '.e-rule-value').querySelectorAll('.e-template');
        var filterElem = closest(element, '.e-rule-container').querySelector('.e-filter-input');
        var dropDownObj = getComponent(filterElem, 'dropdownlist');
        var column = dropDownObj.getDataByValue(dropDownObj.value);
        var format;
        format = this.getFormat(column.format);
        var valueColl = [];
        for (var i = 0, iLen = tempColl.length; i < iLen; i++) {
            if (tempColl[i].nextElementSibling) {
                if (tempColl[i].nextElementSibling.className.indexOf('e-check') > -1) {
                    valueColl.push(tempColl[i].textContent);
                }
                else {
                    if (column.type === 'date' && value[i] instanceof Date) {
                        valueColl.push(this.intl.formatDate(value[i], format));
                    }
                    else {
                        valueColl.push(value[i]);
                    }
                }
            }
            else {
                if (column.type === 'date' && value[i] instanceof Date) {
                    valueColl.push(this.intl.formatDate(value[i], format));
                }
                else {
                    valueColl.push(value[i]);
                }
            }
        }
        if (column.type === 'date') {
            if (value instanceof Date) {
                value = this.intl.formatDate(value, format);
            }
            else if (value instanceof Array) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i] instanceof Date) {
                        value[i] = this.intl.formatDate(value[i], format);
                    }
                }
            }
        }
        this.updateRules(element, (tempColl.length > 1) ? valueColl : value);
    };
    QueryBuilder.prototype.changeValue = function (i, args) {
        var _this = this;
        var groupID;
        var ruleID;
        var element;
        if (args.event) {
            element = args.event.target;
        }
        else {
            var multiSelectArgs = args;
            element = multiSelectArgs.element;
        }
        if (element.className.indexOf('e-day') > -1 || element.className.indexOf('e-cell') > -1) {
            var calenderArgs = args;
            element = calenderArgs.element;
        }
        var groupElem = closest(element, '.e-group-container');
        var ruleElem = closest(element, '.e-rule-container');
        groupID = groupElem && groupElem.id.replace(this.element.id + '_', '');
        ruleID = ruleElem.id.replace(this.element.id + '_', '');
        var dateElement = args;
        if (dateElement.element && dateElement.element.className.indexOf('e-datepicker') > -1) {
            element = dateElement.element;
        }
        var value;
        var rbValue;
        var dropDownObj;
        if (element.className.indexOf('e-radio') > -1) {
            rbValue = parseInt(element.id.split('valuekey')[1], 0);
            dropDownObj =
                getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input'), 'dropdownlist');
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
            if (this.selectedColumn.values) {
                value = this.selectedColumn.values[rbValue];
            }
            else {
                var valColl = ['True', 'False'];
                value = valColl[rbValue];
            }
        }
        else if (element.className.indexOf('e-multiselect') > -1) {
            value = getComponent(element, 'multiselect').value;
        }
        else {
            value = args.value;
        }
        if (args.name === 'input' && this.immediateModeDelay) {
            window.clearInterval(this.timer);
            this.timer = window.setInterval(function () { _this.filterValue(groupID, ruleID, value, i, element); }, this.immediateModeDelay);
        }
        else {
            this.filterValue(groupID, ruleID, value, i, element);
        }
    };
    QueryBuilder.prototype.filterValue = function (grID, rlID, value, i, ele) {
        var _this = this;
        var eventsArgs = { groupID: grID, ruleID: rlID, value: value, cancel: false, type: 'value' };
        window.clearInterval(this.timer);
        if (!this.isImportRules) {
            this.trigger('beforeChange', eventsArgs, function (observedChangeArgs) {
                _this.changeValueSuccessCallBack(observedChangeArgs, ele, i, grID, rlID);
            });
        }
        else {
            this.changeValueSuccessCallBack(eventsArgs, ele, i, grID, rlID);
        }
    };
    QueryBuilder.prototype.changeValueSuccessCallBack = function (args, element, i, groupID, ruleID) {
        if (!args.cancel) {
            this.updateRules(element, args.value, i);
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, ruleID: ruleID, value: args.value, cancel: false, type: 'value' });
            }
        }
    };
    QueryBuilder.prototype.changeField = function (args) {
        if (args.isInteracted) {
            var groupElem = closest(args.element, '.e-group-container');
            var rules = this.getParentGroup(groupElem);
            var ruleElem = closest(args.element, '.e-rule-container');
            var index = 0;
            while (ruleElem && ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            this.changeRule(rules.rules[index], args);
        }
    };
    QueryBuilder.prototype.changeRule = function (rule, ddlArgs) {
        if (!ddlArgs.itemData) {
            return;
        }
        var tempRule = {};
        var filterElem = closest(ddlArgs.element, '.e-rule-filter');
        var ddlObj = getComponent(ddlArgs.element, 'dropdownlist');
        var element = closest(ddlArgs.element, '.e-group-container');
        var groupID = element.id.replace(this.element.id + '_', '');
        this.changeFilter(filterElem, ddlObj, groupID, rule, tempRule, ddlArgs);
    };
    QueryBuilder.prototype.changeFilter = function (flt, dl, grID, rl, tmpRl, dArg) {
        var _this = this;
        if (flt) {
            this.selectedColumn = dl.getDataByValue(dl.value);
            var ruleElem = closest(flt, '.e-rule-container');
            var eventsArgs = void 0;
            var ruleID = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedField: dl.value, cancel: false, type: 'field' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, function (observedChangeArgs) {
                    _this.fieldChangeSuccess(observedChangeArgs, tmpRl, flt, rl, dArg);
                });
            }
            else {
                this.fieldChangeSuccess(eventsArgs, tmpRl, flt, rl, dArg);
            }
        }
        else {
            var operatorElem = closest(dArg.element, '.e-rule-operator');
            this.changeOperator(flt, operatorElem, dl, grID, rl, tmpRl, dArg);
        }
    };
    QueryBuilder.prototype.changeOperator = function (flt, opr, dl, grID, rl, tmpRl, dArg) {
        var _this = this;
        var ruleElem;
        var ruleID;
        var eventsArgs;
        if (opr) {
            ruleElem = closest(opr, '.e-rule-container');
            ruleID = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedIndex: dl.index, cancel: false, type: 'operator' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, function (observedChangeArgs) {
                    _this.operatorChangeSuccess(observedChangeArgs, flt, tmpRl, rl, dArg);
                });
            }
            else {
                this.operatorChangeSuccess(eventsArgs, flt, tmpRl, rl, dArg);
            }
        }
        else {
            this.changeRuleValues(flt, rl, tmpRl, dArg);
        }
    };
    QueryBuilder.prototype.fieldChangeSuccess = function (args, tempRule, filterElem, rule, ddlArgs) {
        var ruleElem = closest(filterElem, '.e-rule-container');
        var operatorElem = closest(ddlArgs.element, '.e-rule-operator');
        var element = closest(ddlArgs.element, '.e-group-container');
        var groupID = element.id.replace(this.element.id + '_', '');
        var ddlObj = getComponent(ddlArgs.element, 'dropdownlist');
        if (!args.cancel) {
            tempRule.type = this.selectedColumn.type;
            if (ruleElem.querySelector('.e-template')) {
                rule.value = '';
            }
            this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        }
        else {
            this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        }
    };
    QueryBuilder.prototype.operatorChangeSuccess = function (eventsArgs, filterElem, tempRule, rule, ddlArgs) {
        if (!eventsArgs.cancel) {
            var operatorElem = closest(ddlArgs.element, '.e-rule-operator');
            var valElem = operatorElem.nextElementSibling;
            var dropDownObj = getComponent(ddlArgs.element, 'dropdownlist');
            var prevOper = rule.operator ? rule.operator.toLowerCase() : '';
            tempRule.operator = dropDownObj.value;
            var currOper = tempRule.operator.toLowerCase();
            if (tempRule.operator.toLowerCase().indexOf('between') > -1 || (tempRule.operator.toLowerCase().indexOf('in') > -1
                && tempRule.operator.toLowerCase().indexOf('contains') < 0)) {
                filterElem = operatorElem.previousElementSibling;
                tempRule.type = rule.type;
                if (tempRule.operator.toLowerCase().indexOf('in') < 0 || rule.operator.toLowerCase().indexOf('in') < 0) {
                    rule.value = [];
                }
            }
            else if (typeof rule.value === 'object' && rule.value != null) {
                rule.value = rule.value.length > 0 ? rule.value[0] : '';
            }
            if (ddlArgs.previousItemData) {
                var prevValue = ddlArgs.previousItemData.value.toLowerCase();
                if (prevValue.indexOf('between') > -1 || (prevValue.indexOf('in') > -1 || (prevValue.indexOf('null') > -1)
                    || (prevValue.indexOf('empty') > -1) && prevValue.indexOf('contains') < 0)) {
                    filterElem = operatorElem.previousElementSibling;
                    tempRule.type = rule.type;
                }
            }
            if ((prevOper.indexOf('in') > -1 && prevOper.indexOf('in') < 5) && (currOper.indexOf('in') > -1
                && currOper.indexOf('in') < 5)) {
                filterElem = null;
            }
            if (tempRule.operator.indexOf('null') > -1 || (tempRule.operator.indexOf('empty') > -1)) {
                var parentElem = operatorElem.parentElement.querySelector('.e-rule-value');
                removeClass([parentElem], 'e-show');
                addClass([parentElem], 'e-hide');
            }
            if (valElem && valElem.querySelector('.e-template')) {
                filterElem = operatorElem.previousElementSibling;
            }
            this.changeRuleValues(filterElem, rule, tempRule, ddlArgs);
        }
    };
    QueryBuilder.prototype.changeRuleValues = function (filterElem, rule, tempRule, ddlArgs) {
        var operatorElem = closest(ddlArgs.element, '.e-rule-operator');
        var ddlObj;
        var operatorList;
        var oprElem;
        if (filterElem) {
            operatorElem = filterElem.nextElementSibling;
            addClass([operatorElem], 'e-operator');
            if (operatorElem.childElementCount) {
                ddlObj = getComponent(operatorElem.querySelector('.e-dropdownlist'), 'dropdownlist');
                tempRule.operator = ddlObj.value;
                var itemData = ddlArgs.itemData;
                this.renderValues(operatorElem, itemData, ddlArgs.previousItemData, true, rule, tempRule, ddlArgs.element);
            }
            else {
                var ruleId = closest(operatorElem, '.e-rule-container').id;
                oprElem = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_operatorkey' } });
                operatorElem.appendChild(oprElem);
                if (this.selectedColumn.operators) {
                    operatorList = this.selectedColumn.operators;
                }
                else if (ddlArgs.itemData) {
                    operatorList = this.customOperators[this.selectedColumn.type + 'Operator'];
                }
                var height = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
                var dropDownList = new DropDownList({
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
                    tempRule.type = this.selectedColumn.type;
                    tempRule.operator = rule.operator;
                }
                this.renderValues(operatorElem, this.selectedColumn, ddlArgs.previousItemData, false, rule, tempRule, ddlArgs.element);
            }
        }
        if (!this.isImportRules) {
            this.updateRules(ddlArgs.element, ddlArgs.item);
        }
    };
    // tslint:disable-next-line:no-any
    QueryBuilder.prototype.destroyControls = function (target) {
        var inputElement;
        inputElement = target.nextElementSibling.querySelectorAll('input.e-control');
        var divElement;
        divElement = target.nextElementSibling.querySelectorAll('div.e-control:not(.e-handle)');
        var columns = this.columns;
        for (var i = 0, len = inputElement.length; i < len; i++) {
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
                var clsName = inputElement[i].className;
                for (var j = 0, jLen = columns.length; j < jLen; j++) {
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
        for (var i = 0, len = divElement.length; i < len; i++) {
            if (divElement[i].className.indexOf('e-template') > -1) {
                var clsName = divElement[i].className;
                for (var j = 0, jLen = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], divElement[i].id);
                        break;
                    }
                }
            }
            detach(divElement[i]);
        }
        var templateElement;
        templateElement = target.nextElementSibling.querySelectorAll('.e-template:not(.e-control)');
        for (var i = 0, len = templateElement.length; i < len; i++) {
            detach(templateElement[i]);
        }
    };
    QueryBuilder.prototype.templateDestroy = function (column, elemId) {
        var temp = column.template.destroy;
        if (column.template && column.template.destroy) {
            var templateElements = void 0;
            templateElements = closest(document.getElementById(elemId), '.e-rule-field').querySelectorAll('.e-template');
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
                temp({ elementId: elemId, elements: templateElements });
            }
            else {
                column.template.destroy({ elementId: elemId, elements: templateElements });
            }
        }
    };
    QueryBuilder.prototype.getDistinctValues = function (dataSource, field) {
        var original = {};
        var result = [];
        for (var i = 0, iLen = dataSource.length; i < iLen; i++) {
            var value = dataSource[i][field];
            if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                value = dataSource[i][field].toString();
            }
            var data = {};
            if (!(value in original)) {
                original[value] = 1;
                data[field] = value;
                result.push(data);
            }
        }
        return result;
    };
    QueryBuilder.prototype.renderMultiSelect = function (rule, parentId, i, selectedValue, values) {
        var isFetched = false;
        var ds;
        var isValues = false;
        if (this.dataColl[1]) {
            if (Object.keys(this.dataColl[1]).indexOf(rule.field) > -1) {
                isFetched = true;
                ds = this.getDistinctValues(this.dataColl, rule.field);
            }
        }
        if (!this.dataColl.length && values.length) {
            isValues = true;
        }
        var multiSelectObj = new MultiSelect({
            dataSource: isValues ? values : (isFetched ? ds : this.dataManager),
            query: new Query([rule.field]),
            fields: { text: rule.field, value: rule.field },
            placeholder: this.l10n.getConstant('SelectValue'),
            value: selectedValue,
            mode: 'CheckBox',
            width: '100%',
            change: this.changeValue.bind(this, i),
            close: this.closePopup.bind(this, i),
            actionBegin: this.multiSelectOpen.bind(this, parentId + '_valuekey' + i)
        });
        multiSelectObj.appendTo('#' + parentId + '_valuekey' + i);
        this.updateRules(multiSelectObj.element, selectedValue, 0);
    };
    QueryBuilder.prototype.multiSelectOpen = function (parentId, args) {
        if (this.dataSource instanceof DataManager) {
            var element = document.getElementById(parentId);
            var dropDownObj = getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input'), 'dropdownlist');
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
            var value = this.selectedColumn.field;
            var isFetched = false;
            if (this.dataColl[1]) {
                if (Object.keys(this.dataColl[1]).indexOf(value) > -1) {
                    isFetched = true;
                }
            }
            if (!isFetched) {
                args.cancel = true;
                if (isBlazor()) {
                    this.bindBlazorMultiSelectData(element, value);
                }
                else {
                    this.bindMultiSelectData(element, value);
                }
            }
        }
    };
    QueryBuilder.prototype.bindBlazorMultiSelectData = function (element, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMultiSelectData(element, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QueryBuilder.prototype.bindMultiSelectData = function (element, value) {
        this.getMultiSelectData(element, value);
    };
    QueryBuilder.prototype.getMultiSelectData = function (element, value) {
        var _this = this;
        var dummyData;
        var deferred = new Deferred();
        var data = this.dataManager.executeQuery(new Query().select(value));
        var multiselectObj = getComponent(element, 'multiselect');
        multiselectObj.hideSpinner();
        this.createSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        showSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        data.then(function (e) {
            if (e.actual && e.actual.result) {
                dummyData = e.actual.result;
            }
            else {
                dummyData = e.result;
            }
            _this.dataColl = extend(_this.dataColl, dummyData, [], true);
            multiselectObj.dataSource = _this.getDistinctValues(_this.dataColl, value);
            hideSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        }).catch(function (e) {
            deferred.reject(e);
        });
    };
    QueryBuilder.prototype.createSpinner = function (element) {
        var spinnerElem = this.createElement('span', { attrs: { class: 'e-qb-spinner' } });
        element.appendChild(spinnerElem);
        createSpinner({ target: spinnerElem, width: Browser.isDevice ? '16px' : '14px' });
    };
    QueryBuilder.prototype.closePopup = function (i, args) {
        var element = document.getElementById(args.popup.element.id.replace('_popup', ''));
        var value = getComponent(element, 'multiselect').value;
        this.updateRules(element, value, i);
    };
    QueryBuilder.prototype.processTemplate = function (target, itemData, rule, tempRule) {
        var container = closest(target, '.e-rule-container');
        var tempElements = container.querySelectorAll('.e-template');
        var idx = getComponent(container.querySelector('.e-rule-filter .e-filter-input'), 'dropdownlist').index;
        if (tempElements.length < 2) {
            if (itemData.template && typeof itemData.template.write === 'string') {
                getValue(itemData.template.write, window)({ elements: tempElements[0], values: rule.value, operator: tempRule.operator,
                    dataSource: this.columns[idx].values });
            }
            else if (itemData.template && itemData.template.write) {
                itemData.template.write({ elements: tempElements[0], values: rule.value, operator: tempRule.operator,
                    dataSource: this.columns[idx].values });
            }
        }
        else {
            if (itemData.template && typeof itemData.template.write === 'string') {
                getValue(itemData.template.write, window)({ elements: tempElements, values: rule.value, operator: tempRule.operator,
                    dataSource: this.columns[idx].values });
            }
            else if (itemData.template && itemData.template.write) {
                itemData.template.write({ elements: tempElements, values: rule.value, operator: tempRule.operator,
                    dataSource: this.columns[idx].values });
            }
        }
    };
    QueryBuilder.prototype.getItemData = function (parentId) {
        var fieldObj = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist');
        return this.columns[fieldObj.index];
    };
    QueryBuilder.prototype.setDefaultValue = function (parentId, isArryValue, isNumber) {
        var itemData = this.getItemData(parentId);
        if (isNullOrUndefined(itemData.value)) {
            return isNumber ? isArryValue ? [0, 0] : 0 : isArryValue ? [] : '';
        }
        if (isArryValue) {
            if (!(itemData.value instanceof Array)) {
                return [itemData.value];
            }
        }
        else {
            if (itemData.value instanceof Array) {
                return itemData.value[0];
            }
        }
        // this.updateRules(ruleValElem, itemData.defaultValue, idx);
        return itemData.value;
    };
    QueryBuilder.prototype.renderStringValue = function (parentId, rule, operator, idx, ruleValElem) {
        var selectedVal;
        var columnData = this.getItemData(parentId);
        var selectedValue;
        if (this.isImportRules || this.isPublic) {
            selectedValue = rule.value;
        }
        else {
            selectedValue = this.setDefaultValue(parentId, false, false);
        }
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values)) {
            selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
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
                selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
                selectedValue = selectedVal.join(',');
            }
            var inputobj = new TextBox({
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selectedValue;
            inputobj.dataBind();
        }
    };
    QueryBuilder.prototype.renderNumberValue = function (parentId, rule, operator, idx, ruleValElem, itemData, length) {
        var columnData = this.getItemData(parentId);
        var selectedVal = (this.isImportRules || this.isPublic) ? rule.value : this.setDefaultValue(parentId, false, true);
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values)) {
            selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                ruleValElem.style.width = '100%';
            }
            else {
                ruleValElem.style.minWidth = '200px';
                ruleValElem.style.width = null;
            }
        }
        else if (operator === 'in' || operator === 'notin') {
            selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
            var selVal = selectedVal.join(',');
            var inputobj = new TextBox({
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selVal;
            inputobj.dataBind();
        }
        else {
            var fieldObj = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist');
            itemData = this.columns[fieldObj.index];
            var min = (itemData.validation && itemData.validation.min) ? itemData.validation.min : 0;
            var max = (itemData.validation && itemData.validation.max) ? itemData.validation.max : Number.MAX_VALUE;
            var format = itemData.format ? itemData.format : 'n';
            if (length > 1 && rule) {
                selectedVal = rule.value[idx] ? rule.value[idx] : this.setDefaultValue(parentId, true, true);
            }
            var numeric = new NumericTextBox({
                value: (selectedVal instanceof Array) ? selectedVal[idx] : selectedVal,
                format: format, min: min, max: max, width: '100%',
                step: itemData.step ? itemData.step : 1,
                change: this.changeValue.bind(this, idx)
            });
            numeric.appendTo('#' + parentId + '_valuekey' + idx);
        }
    };
    QueryBuilder.prototype.processValueString = function (value, type) {
        var numArr = [];
        var strArr = value.split(',');
        if (type === 'string') {
            return strArr;
        }
        else {
            for (var k = 0, kLen = strArr.length; k < kLen; k++) {
                numArr.push(Number(strArr[k]));
            }
            return numArr;
        }
    };
    QueryBuilder.prototype.parseDate = function (value, format) {
        var formatOpt;
        var selectedValue;
        if (format) {
            var dParser = this.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
            formatOpt = this.getFormat(format);
            selectedValue = dParser(value);
            if (isNullOrUndefined(selectedValue)) {
                selectedValue = this.intl.parseDate(value, formatOpt);
            }
        }
        else {
            selectedValue = new Date(value);
        }
        return selectedValue;
    };
    QueryBuilder.prototype.renderControls = function (target, itemData, rule, tempRule) {
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-value');
        removeClass([target.parentElement.querySelector('.e-rule-value')], 'e-hide');
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-show');
        if (itemData.template) {
            this.processTemplate(target, itemData, rule, tempRule);
        }
        else {
            var length_1;
            if (tempRule.type === 'boolean') {
                length_1 = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
            }
            else {
                length_1 = tempRule.operator && tempRule.operator.toLowerCase().indexOf('between') > -1 ? 2 : 1;
            }
            var parentId = closest(target, '.e-rule-container').id;
            var ruleValElem = void 0;
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
                for (var i = 0; i < length_1; i++) {
                    switch (tempRule.type) {
                        case 'string':
                            {
                                this.renderStringValue(parentId, rule, tempRule.operator, i, ruleValElem);
                            }
                            break;
                        case 'number':
                            {
                                this.renderNumberValue(parentId, rule, tempRule.operator, i, ruleValElem, itemData, length_1);
                            }
                            break;
                        case 'boolean':
                            {
                                var values = itemData.values && itemData.values.length ? itemData.values : ['True', 'False'];
                                var isCheck = false;
                                if (rule.type === 'boolean' && rule.value) {
                                    isCheck = values[i].toLowerCase() === rule.value.toString().toLowerCase();
                                }
                                else if (itemData.value) {
                                    isCheck = values[i].toLowerCase() === itemData.value.toString().toLowerCase();
                                }
                                else if (i === 0) {
                                    isCheck = true;
                                }
                                var radiobutton = new RadioButton({
                                    label: values[i].toString(), name: parentId + 'default', checked: isCheck, value: values[i],
                                    change: this.changeValue.bind(this, i)
                                });
                                radiobutton.appendTo('#' + parentId + '_valuekey' + i);
                                if (isCheck) {
                                    this.updateRules(radiobutton.element, values[i], 0);
                                }
                            }
                            break;
                        case 'date':
                            {
                                var selectedValue = new Date();
                                var selVal = void 0;
                                var column = void 0;
                                var format = itemData.format;
                                var datepick = void 0;
                                var place = this.l10n.getConstant('SelectValue');
                                if (itemData.value) {
                                    if (itemData.value instanceof Date) {
                                        selectedValue = itemData.value;
                                    }
                                    else if (itemData.value instanceof Number) {
                                        selectedValue = new Date(itemData.value);
                                    }
                                    else {
                                        selectedValue = this.parseDate(itemData.value, itemData.format);
                                    }
                                }
                                if ((this.isImportRules || this.isPublic) && rule && rule.value) {
                                    column = this.getColumn(rule.field);
                                    selVal = (length_1 > 1) ? rule.value[i] : rule.value;
                                    selectedValue = this.parseDate(selVal, column.format);
                                    format = column.format;
                                }
                                if (format) {
                                    var formatObj = this.getFormat(format);
                                    if (formatObj.skeleton) {
                                        datepick = new DatePicker({ locale: this.getLocale(), value: selectedValue,
                                            placeholder: place, format: formatObj, change: this.changeValue.bind(this, i) });
                                    }
                                    else {
                                        datepick = new DatePicker({ value: selectedValue, locale: this.getLocale(),
                                            placeholder: place, format: formatObj.format, change: this.changeValue.bind(this, i) });
                                    }
                                }
                                else {
                                    datepick = new DatePicker({ locale: this.getLocale(),
                                        value: selectedValue, placeholder: place, change: this.changeValue.bind(this, i) });
                                }
                                datepick.appendTo('#' + parentId + '_valuekey' + i);
                                if (!rule.value) {
                                    this.updateRules(document.getElementById(parentId + '_valuekey' + i), selectedValue);
                                }
                            }
                            break;
                    }
                }
            }
        }
    };
    QueryBuilder.prototype.getOperatorIndex = function (ddlObj, rule) {
        var i;
        var dataSource = ddlObj.dataSource;
        var len = dataSource.length;
        for (i = 0; i < len; i++) {
            if (rule.operator === ddlObj.dataSource[i].value) {
                return i;
            }
        }
        return 0;
    };
    QueryBuilder.prototype.renderValues = function (target, itemData, prevItemData, isRender, rule, tempRule, element) {
        if (isRender) {
            var ddlObj = getComponent(target.querySelector('input'), 'dropdownlist');
            if (itemData.operators) {
                ddlObj.dataSource = itemData.operators;
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value;
                ddlObj.dataBind();
            }
            else if (itemData.type) {
                ddlObj.dataSource = this.customOperators[itemData.type + 'Operator'];
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value;
                ddlObj.dataBind();
            }
        }
        if (!(tempRule.operator.indexOf('null') > -1 || tempRule.operator.indexOf('empty') > -1)) {
            var parentId = closest(target, '.e-rule-container').id;
            if (prevItemData && prevItemData.template) {
                this.templateDestroy(prevItemData, parentId + '_valuekey0');
                detach(target.nextElementSibling.querySelector('#' + parentId + '_valuekey0'));
            }
            if (isRender) {
                this.destroyControls(target);
            }
            var filtElem = document.getElementById(element.id.replace('operatorkey', 'filterkey'));
            var filtObj = getComponent(filtElem, 'dropdownlist');
            itemData.template = this.columns[filtObj.index].template;
            if (itemData.template) {
                addClass([target.nextElementSibling], 'e-template-value');
                itemData.template = this.columns[filtObj.index].template;
                var valElem = void 0;
                if (itemData.template && typeof itemData.template.create === 'string') {
                    valElem = getValue(itemData.template.create, window)({ operator: itemData.value || tempRule.operator });
                }
                else if (itemData.template && itemData.template.create) {
                    valElem = itemData.template.create({ operator: itemData.value || tempRule.operator });
                }
                if (valElem instanceof Element) {
                    valElem.id = parentId + '_valuekey0';
                    addClass([valElem], 'e-template');
                    addClass([valElem], 'e-' + this.columns[filtObj.index].field);
                    target.nextElementSibling.appendChild(valElem);
                }
                else if (valElem instanceof Array) {
                    addClass(valElem, 'e-template');
                    for (var i = 0, iLen = valElem.length; i < iLen; i++) {
                        valElem[i].id = parentId + '_valuekey' + i;
                        target.nextElementSibling.appendChild(valElem[i]);
                    }
                }
                var parentElem = target.parentElement.querySelector('.e-rule-value');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    parentElem.style.width = '100%';
                }
                else {
                    parentElem.style.minWidth = '200px';
                }
            }
            else {
                removeClass([target.nextElementSibling], 'e-template-value');
                var inputLen = 1;
                if (tempRule.type === 'boolean') {
                    inputLen = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
                }
                else {
                    inputLen = (tempRule.operator && tempRule.operator.toLowerCase().indexOf('between') > -1) ? 2 : 1;
                }
                for (var i = 0; i < inputLen; i++) {
                    var valElem = void 0;
                    valElem = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey' + i } });
                    target.nextElementSibling.appendChild(valElem);
                }
            }
            this.renderControls(target, itemData, rule, tempRule);
        }
    };
    QueryBuilder.prototype.updateValues = function (element, rule) {
        var idx = 1;
        if (element.className.indexOf('e-template') > -1) {
            idx = 3;
        }
        var controlName = element.className.split(' e-')[idx];
        var i = parseInt(element.id.slice(-1), 2);
        switch (controlName) {
            case 'textbox':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'dropdownlist':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'radio':
                var radioBtnObj = getComponent(element, controlName);
                if (radioBtnObj.checked) {
                    rule.value = radioBtnObj.value;
                }
                radioBtnObj.refresh();
                break;
            case 'numerictextbox':
                if (rule.operator.indexOf('between') > -1) {
                    if (typeof rule.value === 'string') {
                        rule.value = [];
                    }
                    rule.value[i] = getComponent(element, controlName).value;
                }
                else {
                    rule.value = getComponent(element, controlName).value;
                }
                break;
            case 'datepicker':
                var column = this.getColumn(rule.field);
                var format = this.getFormat(column.format);
                var selectedDate = getComponent(element, controlName).value;
                if (rule.operator.indexOf('between') > -1) {
                    if (typeof rule.value === 'string') {
                        rule.value = [];
                    }
                    rule.value[i] = selectedDate;
                }
                else if (isNullOrUndefined(format.format) && selectedDate) {
                    rule.value = this.intl.formatDate(selectedDate);
                }
                else if (selectedDate) {
                    rule.value = this.intl.formatDate(selectedDate, format);
                }
                else {
                    rule.value = '';
                }
                break;
            case 'multiselect':
                rule.value = getComponent(element, controlName).value;
                break;
        }
    };
    QueryBuilder.prototype.updateRules = function (target, selectedValue, i) {
        var groupElem = closest(target, '.e-group-container');
        var rule = this.getParentGroup(groupElem);
        var ruleElem = closest(target, '.e-rule-container');
        var index = 0;
        var dropDownObj;
        var eventsArgs;
        var groupID = groupElem.id.replace(this.element.id + '_', '');
        var ruleID;
        var beforeRules = this.getValidRules(this.rule);
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        ruleElem = closest(target, '.e-rule-container');
        ruleID = ruleElem.id.replace(this.element.id + '_', '');
        if (closest(target, '.e-rule-filter')) {
            dropDownObj = getComponent(target, 'dropdownlist');
            if (!this.isImportRules && rule.rules[index].field.toLowerCase() !== this.columns[dropDownObj.index].field.toLowerCase()) {
                if (!(rule.rules[index].operator.indexOf('null') > -1) || (rule.rules[index].operator.indexOf('empty') > -1)) {
                    rule.rules[index].value = '';
                }
            }
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
            rule.rules[index].field = this.selectedColumn.field;
            rule.rules[index].type = this.selectedColumn.type;
            rule.rules[index].label = this.selectedColumn.label;
            var ruleElement = closest(target, '.e-rule-filter');
            var element = ruleElement.nextElementSibling.querySelector('input.e-control');
            var operator = getComponent(element, 'dropdownlist').value;
            rule.rules[index].operator = operator;
            // Value Fields
            var valueContainer = ruleElement.nextElementSibling.nextElementSibling;
            var elementCln = valueContainer.querySelectorAll('input.e-control');
            if (elementCln.length < 1) {
                elementCln = valueContainer.querySelectorAll('.e-template');
            }
            for (var i_1 = 0; i_1 < elementCln.length; i_1++) {
                if (!elementCln[i_1]) {
                    elementCln[i_1] = ruleElement.nextElementSibling.nextElementSibling.querySelector('div.e-control');
                }
                if (!elementCln[i_1]) {
                    elementCln[i_1] = ruleElement.nextElementSibling.nextElementSibling.querySelector('.e-template');
                }
                eventsArgs = { groupID: groupID, ruleID: ruleID, value: rule.rules[index].field, type: 'field' };
                if (rule.rules[index].operator.indexOf('null') > -1 || rule.rules[index].operator.indexOf('empty') > -1) {
                    rule.rules[index].value = null;
                    continue;
                }
                this.updateValues(elementCln[i_1], rule.rules[index]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            if (this.allowValidation && rule.rules[index].field && target.parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(target.parentElement, 'tooltip').destroy();
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'field');
        }
        else if (closest(target, '.e-rule-operator')) {
            dropDownObj = getComponent(target, 'dropdownlist');
            rule.rules[index].operator = dropDownObj.value;
            var inputElem = void 0;
            var parentElem = target.parentElement;
            inputElem = ruleElem.querySelectorAll('.e-rule-value input.e-control');
            eventsArgs = { groupID: groupID, ruleID: ruleID, value: dropDownObj.value, type: 'operator' };
            if (this.allowValidation && rule.rules[index].operator && target.parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(target.parentElement, 'tooltip').destroy();
            }
            if (inputElem.length > 1) {
                rule.rules[index].value = [];
            }
            for (var i_2 = 0; i_2 < inputElem.length; i_2++) {
                if (rule.rules[index].operator.indexOf('null') > -1 || rule.rules[index].operator.indexOf('empty') > -1) {
                    rule.rules[index].value = null;
                    continue;
                }
                this.updateValues(inputElem[i_2], rule.rules[index]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'operator');
        }
        else if (closest(target, '.e-rule-value')) {
            this.ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i);
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'value');
        }
    };
    QueryBuilder.prototype.filterRules = function (beforeRule, afterRule, type) {
        var beforeRuleStr = JSON.stringify({ condition: beforeRule.condition, not: beforeRule.not, rule: beforeRule.rules });
        var afetrRuleStr = JSON.stringify({ condition: afterRule.condition, not: afterRule.not, rule: afterRule.rules });
        if (beforeRuleStr !== afetrRuleStr) {
            if (!this.isImportRules) {
                this.trigger('ruleChange', { previousRule: beforeRule, rule: afterRule, type: type });
            }
        }
    };
    QueryBuilder.prototype.ruleValueUpdate = function (target, selectedValue, rule, index, groupElem, ruleElem, i) {
        var eventsArgs;
        var oper;
        var arrOperator = ['in', 'between', 'notin', 'notbetween'];
        if (selectedValue !== null) {
            if (rule.rules[index].operator) {
                oper = rule.rules[index].operator.toLowerCase();
            }
            if (target.className.indexOf('e-multiselect') > -1 && rule.rules[index].type === 'number') {
                var selVal = [];
                var dupSelectedValue = selectedValue;
                for (var k = 0, kLen = dupSelectedValue.length; k < kLen; k++) {
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
                eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: rule.rules[index].value, type: 'value' };
                if (!this.isImportRules) {
                    this.trigger('change', eventsArgs);
                }
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
                var ddlInst = getInstance(ruleElem.querySelector('.e-rule-filter input'), DropDownList);
                var format = this.getFormat(this.columns[ddlInst.index].format);
                if (format.type) {
                    if (arrOperator.indexOf(oper) > -1) {
                        if (typeof rule.rules[index].value === 'string') {
                            rule.rules[index].value = [];
                        }
                        rule.rules[index].value[i] = this.intl.formatDate(selectedValue, format);
                    }
                    else {
                        rule.rules[index].value = this.intl.formatDate(selectedValue, format);
                    }
                }
            }
            this.validatValue(rule, index, ruleElem);
        }
    };
    QueryBuilder.prototype.validatValue = function (rule, index, ruleElem) {
        if (this.allowValidation && rule.rules[index].value) {
            var valElem = ruleElem.querySelectorAll('.e-rule-value .e-control');
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
    };
    QueryBuilder.prototype.getFormat = function (format) {
        var formatOptions;
        if (format) {
            if (typeof (format) === 'string') {
                formatOptions = { type: 'dateTime', format: format };
                if (format === 'short') {
                    formatOptions.skeleton = format;
                }
            }
            else {
                formatOptions = { type: 'dateTime', skeleton: format.skeleton };
            }
        }
        else {
            formatOptions = { type: 'dateTime', skeleton: 'yMd' };
        }
        return formatOptions;
    };
    QueryBuilder.prototype.findGroupByIdx = function (groupIdx, rule, isRoot) {
        var ruleColl = rule.rules;
        var dupRuleColl = [];
        if (!isRoot) {
            for (var j = 0, jLen = ruleColl.length; j < jLen; j++) {
                rule = ruleColl[j];
                if (rule.rules) {
                    dupRuleColl.push(rule);
                }
            }
            return dupRuleColl[groupIdx];
        }
        return rule;
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    QueryBuilder.prototype.destroy = function () {
        var queryElement = this.element;
        if (!queryElement) {
            return;
        }
        var element;
        var i;
        var len;
        var tooltip;
        _super.prototype.destroy.call(this);
        element = this.element.querySelectorAll('.e-addrulegroup');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdown-btn').destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-filter .e-control.e-tooltip');
        for (i = 0; i < tooltip.length; i++) {
            getComponent(tooltip[i], 'tooltip').destroy();
        }
        element = this.element.querySelectorAll('.e-rule-filter .e-control:not(.e-tooltip)');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdownlist').destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-operator .e-control.e-tooltip');
        for (i = 0; i < tooltip.length; i++) {
            getComponent(tooltip[i], 'tooltip').destroy();
        }
        element = this.element.querySelectorAll('.e-rule-operator .e-control:not(.e-tooltip)');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdownlist').destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-value .e-control.e-tooltip');
        for (i = 0; i < tooltip.length; i++) {
            getComponent(tooltip[i], 'tooltip').destroy();
        }
        this.isImportRules = false;
        this.unWireEvents();
        this.levelColl[this.element.id + '_group0'] = [0];
        this.element.innerHTML = '';
        classList(this.element, [], ['e-rtl', 'e-responsive', 'e-device']);
    };
    /**
     * Adds single or multiple rules.
     * @returns void.
     */
    QueryBuilder.prototype.addRules = function (rule, groupID) {
        groupID = this.element.id + '_' + groupID;
        this.isPublic = true;
        for (var i = 0, len = rule.length; i < len; i++) {
            this.addRuleElement(document.getElementById(groupID), rule[i]);
        }
        this.isPublic = false;
    };
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    QueryBuilder.prototype.addGroups = function (groups, groupID) {
        groupID = this.element.id + '_' + groupID;
        var groupElem = document.getElementById(groupID);
        var rule = this.getParentGroup(groupElem);
        var grouplen = groups.length;
        if (grouplen) {
            for (var i = 0, len = groups.length; i < len; i++) {
                this.importRules(groups[i], groupElem);
            }
        }
        else {
            if (this.enableNotCondition) {
                rule.rules.push({ 'condition': 'and', 'not': false, rules: [] });
            }
            else {
                rule.rules.push({ 'condition': 'and', rules: [] });
            }
        }
        var andElem = groupElem.querySelector('.e-btngroup-and');
        var orElem = groupElem.querySelector('.e-btngroup-or');
        if (andElem.disabled) {
            andElem.removeAttribute('disabled');
            andElem.checked = true;
            orElem.removeAttribute('disabled');
        }
    };
    QueryBuilder.prototype.initWrapper = function () {
        this.isInitialLoad = true;
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
        if (this.summaryView) {
            if (this.isImportRules) {
                this.renderSummary();
            }
            else {
                this.renderSummaryCollapse();
            }
        }
        else {
            if (this.columns.length && this.isImportRules) {
                this.addGroupElement(false, this.element, this.rule.condition);
                var mRules = extend({}, this.rule, {}, true);
                this.setGroupRules(mRules);
            }
            else if (this.columns.length) {
                this.addRuleElement(this.element.querySelector('.e-group-container'), {});
            }
            this.notGroupRtl();
            var buttons = document.querySelectorAll('label.e-btn');
            var button = void 0;
            for (var i = 0; i < buttons.length; i++) {
                button = buttons.item(i);
                rippleEffect(button, { selector: '.e-btn' });
            }
        }
    };
    QueryBuilder.prototype.renderSummary = function () {
        var contentElem = this.createElement('div', {
            attrs: {
                class: 'e-summary-content',
                id: this.element.id + '_summary_content'
            }
        });
        var textElem = this.createElement('textarea', { attrs: { class: 'e-summary-text', readonly: 'true' }, styles: 'max-height:500px' });
        var editElem = this.createElement('button', { attrs: { class: 'e-edit-rule e-css e-btn e-small e-flat e-primary' } });
        var divElem = this.createElement('div', { attrs: { class: 'e-summary-btndiv' } });
        contentElem.appendChild(textElem);
        textElem.textContent = this.getSqlFromRules(this.rule);
        editElem.textContent = this.l10n.getConstant('Edit');
        divElem.appendChild(editElem);
        contentElem.appendChild(divElem);
        this.element.appendChild(contentElem);
    };
    QueryBuilder.prototype.renderSummaryCollapse = function () {
        var collapseElem = this.createElement('div', {
            attrs: {
                class: 'e-collapse-rule e-icons',
                title: this.l10n.getConstant('SummaryViewTitle')
            }
        });
        this.element.querySelector('.e-group-header').appendChild(collapseElem);
    };
    QueryBuilder.prototype.columnSort = function () {
        if (this.sortDirection.toLowerCase() === 'descending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortByDesc('field'));
        }
        else if (this.sortDirection.toLowerCase() === 'ascending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortBy('field'));
        }
    };
    QueryBuilder.prototype.onChangeNotGroup = function () {
        this.element.innerHTML = '';
        this.groupIdCounter = 0;
        if (this.enableNotCondition) {
            if (this.enableNotCondition) {
                var inputElem = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' } });
                this.groupElem.querySelector('.e-btn-group').insertBefore(inputElem, this.groupElem.querySelector('.e-btngroup-and'));
            }
        }
        else {
            this.groupElem.querySelector('.e-qb-toggle').remove();
        }
        this.rule = this.checkNotGroup(this.rule);
        this.initWrapper();
    };
    QueryBuilder.prototype.notGroupRtl = function () {
        if (this.enableRtl) {
            addClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        }
        else {
            removeClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        }
    };
    QueryBuilder.prototype.checkNotGroup = function (rule) {
        var orgRule;
        if (rule.rules) {
            for (var i = 0; i < rule.rules.length; i++) {
                orgRule = rule.rules[i];
                orgRule = this.checkNotGroup(orgRule);
                rule.rules[i] = orgRule;
            }
        }
        if (!isNullOrUndefined(rule.not)) {
            if (this.enableNotCondition) {
                rule.not = false;
            }
            delete rule.not;
        }
        else if (this.enableNotCondition && !isNullOrUndefined(rule.condition)) {
            rule.not = false;
        }
        return rule;
    };
    QueryBuilder.prototype.onPropertyChanged = function (newProp, oldProp) {
        var properties = Object.keys(newProp);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            switch (prop) {
                case 'summaryView':
                    var groupElem = this.element.querySelector('.e-group-container');
                    var summaryElem = this.element.querySelector('.e-summary-content');
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
                        this.notGroupRtl();
                    }
                    else {
                        removeClass([this.element], 'e-rtl');
                        this.notGroupRtl();
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
                    newProp.rule = this.getRuleCollection(this.rule, false);
                    break;
                case 'width':
                    this.width = newProp.width;
                    this.element.style.width = this.width;
                    break;
                case 'locale':
                    this.locale = newProp.locale;
                    this.intl = new Internationalization(this.locale);
                    this.refresh();
                    break;
                case 'enableNotCondition':
                    this.onChangeNotGroup();
                    break;
            }
        }
    };
    QueryBuilder.prototype.preRender = function () {
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
            SummaryViewTitle: 'Summary View',
            OtherFields: 'Other Fields',
            AND: 'AND',
            OR: 'OR',
            NOT: 'NOT',
            SelectValue: 'Enter Value',
            IsEmpty: 'Is Empty',
            IsNotEmpty: 'Is Not Empty',
            IsNull: 'Is Null',
            IsNotNull: 'Is Not Null'
        };
        this.l10n = new L10n('querybuilder', this.defaultLocale, this.locale);
        this.intl = new Internationalization(this.locale);
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
                { value: 'notin', key: this.l10n.getConstant('NotIn') },
                { value: 'isempty', key: this.l10n.getConstant('IsEmpty') },
                { value: 'isnotempty', key: this.l10n.getConstant('IsNotEmpty') },
                { value: 'isnull', key: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
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
                { value: 'notin', key: this.l10n.getConstant('NotIn') },
                { value: 'isnull', key: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
            ],
        };
        this.operators = {
            equal: '=', notequal: '!=', greaterthan: '>', greaterthanorequal: '>=', lessthan: '<', in: 'IN', notin: 'NOT IN',
            lessthanorequal: '<=', startswith: 'LIKE', endswith: 'LIKE', between: 'BETWEEN', notbetween: 'NOT BETWEEN', contains: 'LIKE',
            isnull: 'IS NULL', isnotnull: 'IS NOT NULL', isempty: 'IS EMPTY', isnotempty: 'IS NOT EMPTY', notstartswith: 'NOT LIKE',
            notendswith: 'NOT LIKE', notcontains: 'NOT LIKE'
        };
        this.fields = { text: 'label', value: 'field' };
    };
    QueryBuilder.prototype.render = function () {
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
            this.executeDataManager(new Query().take(1));
        }
        else {
            this.dataManager = new DataManager(this.dataSource);
            this.dataColl = this.dataManager.executeLocal(new Query());
            this.initControl();
        }
        this.renderComplete();
    };
    QueryBuilder.prototype.executeDataManager = function (query) {
        var _this = this;
        var data = this.dataManager.executeQuery(query);
        var deferred = new Deferred();
        data.then(function (e) {
            if (e.actual && e.actual.result) {
                _this.dataColl = e.actual.result;
            }
            else {
                _this.dataColl = e.result;
            }
            _this.initControl();
        }).catch(function (e) {
            deferred.reject(e);
        });
    };
    QueryBuilder.prototype.initControl = function () {
        this.initialize();
        this.initWrapper();
        this.wireEvents();
    };
    QueryBuilder.prototype.wireEvents = function () {
        var wrapper = this.getWrapper();
        EventHandler.add(wrapper, 'click', this.clickEventHandler, this);
    };
    QueryBuilder.prototype.unWireEvents = function () {
        var wrapper = this.getWrapper();
        EventHandler.remove(wrapper, 'click', this.clickEventHandler);
    };
    QueryBuilder.prototype.getParentGroup = function (target, isParent) {
        var groupLevel = (target instanceof Element) ? this.levelColl[target.id] : this.levelColl[target];
        var len = isParent ? groupLevel.length - 1 : groupLevel.length;
        var rule = this.rule;
        for (var i = 0; i < len; i++) {
            rule = this.findGroupByIdx(groupLevel[i], rule, i === 0);
        }
        return rule;
    };
    QueryBuilder.prototype.deleteGroup = function (target) {
        var _this = this;
        var groupElem = target;
        var groupId = groupElem.id.replace(this.element.id + '_', '');
        var args = { groupID: groupId, cancel: false, type: 'deleteGroup' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, function (observedChangeArgs) {
                _this.deleteGroupSuccessCallBack(observedChangeArgs, target);
            });
        }
        else {
            this.deleteGroupSuccessCallBack(args, target);
        }
    };
    QueryBuilder.prototype.deleteGroupSuccessCallBack = function (args, target) {
        if (!args.cancel) {
            if (this.actionButton) {
                getComponent(this.actionButton, 'tooltip').destroy();
            }
            var groupElem = target;
            var rule = this.getParentGroup(groupElem, true);
            var index = 0;
            var i = void 0;
            var len = void 0;
            var beforeRules = this.getValidRules(this.rule);
            var nextElem = groupElem.nextElementSibling;
            var prevElem = groupElem.previousElementSibling;
            var element = groupElem.querySelectorAll('.e-group-container');
            var valElem = groupElem.querySelectorAll('.e-tooltip');
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
            delete this.levelColl[args.groupID];
            var elem = groupElem.parentElement.parentElement.parentElement;
            detach(target);
            this.refreshLevelColl();
            this.disableRuleCondition(elem);
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteGroup');
        }
    };
    QueryBuilder.prototype.deleteRule = function (target) {
        var _this = this;
        var groupElem = closest(target, '.e-group-container');
        var ruleID;
        var groupID;
        groupID = groupElem.id.replace(this.element.id + '_', '');
        ruleID = closest(target, '.e-rule-container').id.replace(this.element.id + '_', '');
        var args = { groupID: groupID, ruleID: ruleID, cancel: false, type: 'deleteRule' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, function (observedChangeArgs) {
                _this.deleteRuleSuccessCallBack(observedChangeArgs, target);
            });
        }
        else {
            this.deleteRuleSuccessCallBack(args, target);
        }
    };
    QueryBuilder.prototype.deleteRuleSuccessCallBack = function (args, target) {
        if (!args.cancel) {
            if (this.actionButton && this.actionButton.className.indexOf('e-tooltip') > -1) {
                getComponent(this.actionButton, 'tooltip').destroy();
            }
            var groupElem = closest(target, '.e-group-container');
            var rule = this.getParentGroup(groupElem);
            var ruleElem = closest(target, '.e-rule-container');
            var beforeRules = this.getValidRules(this.rule);
            var clnruleElem = ruleElem;
            var nextElem = ruleElem.nextElementSibling;
            var prevElem = ruleElem.previousElementSibling;
            var index = 0;
            var valElem = ruleElem.querySelectorAll('.e-tooltip');
            var i = void 0;
            var len = valElem.length;
            for (i = 0; i < len; i++) {
                getComponent(valElem[i], 'tooltip').destroy();
            }
            while (ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            rule.rules.splice(index, 1);
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
            this.disableRuleCondition(groupElem);
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteRule');
        }
    };
    QueryBuilder.prototype.setGroupRules = function (rule) {
        this.reset();
        this.groupIdCounter = 1;
        this.ruleIdCounter = 0;
        this.isImportRules = true;
        this.rule = rule;
        rule = this.getRuleCollection(this.rule, false);
        this.importRules(this.rule, this.element.querySelector('.e-group-container'), true);
        this.isImportRules = false;
    };
    QueryBuilder.prototype.disableRuleCondition = function (groupElem) {
        var count = groupElem.querySelector('.e-rule-list').childElementCount;
        var andElem = groupElem.querySelector('.e-btngroup-and');
        var orElem = groupElem.querySelector('.e-btngroup-or');
        if (count > 1) {
            andElem.disabled = false;
            andElem.checked = true;
            orElem.disabled = false;
        }
        else {
            andElem.checked = false;
            andElem.disabled = true;
            orElem.checked = false;
            orElem.disabled = true;
        }
    };
    /**
     * return the valid rule or rules collection.
     * @returns RuleModel.
     */
    QueryBuilder.prototype.getValidRules = function (currentRule) {
        var ruleCondtion = currentRule.condition;
        var notCondition = currentRule.not;
        var ruleColl = extend([], currentRule.rules, [], true);
        var rule = this.getRuleCollection({ condition: ruleCondtion, rules: ruleColl, not: notCondition }, true);
        return rule;
    };
    QueryBuilder.prototype.getRuleCollection = function (rule, isValidRule) {
        var orgRule;
        if (rule.rules && rule.rules.length && (Object.keys(rule.rules[0]).length > 6 || isValidRule)) {
            var jLen = rule.rules.length;
            for (var j = 0; j < jLen; j++) {
                orgRule = rule.rules[j];
                orgRule = this.getRuleCollection(orgRule, isValidRule);
                rule.rules[j] = orgRule;
                if (Object.keys(orgRule).length < 1 && isValidRule) {
                    rule.rules.splice(j, 1);
                    j--;
                    jLen--;
                }
            }
        }
        if (!rule.condition && rule.condition !== '') {
            if (rule.operator) {
                if (rule.operator.indexOf('null') > -1 || rule.operator.indexOf('empty') > -1) {
                    rule.value = null;
                }
            }
            if (rule.field !== '' && rule.operator !== '' && rule.value !== '') {
                rule = {
                    'label': rule.label, 'field': rule.field, 'operator': rule.operator, 'type': rule.type, 'value': rule.value
                };
            }
            else {
                rule = {};
            }
        }
        else {
            if (this.enableNotCondition) {
                rule = { 'condition': rule.condition, 'rules': rule.rules, 'not': rule.not };
            }
            else {
                rule = { 'condition': rule.condition, 'rules': rule.rules };
            }
        }
        return rule;
    };
    /**
     * Set the rule or rules collection.
     * @returns void.
     */
    QueryBuilder.prototype.setRules = function (rule) {
        var mRules = extend({}, rule, {}, true);
        this.setGroupRules(mRules);
    };
    /**
     * Gets the rule or rule collection.
     * @returns object.
     */
    QueryBuilder.prototype.getRules = function () {
        if (this.enableNotCondition) {
            return { condition: this.rule.condition, rules: this.rule.rules, not: this.rule.not };
        }
        else {
            return { condition: this.rule.condition, rules: this.rule.rules };
        }
    };
    /**
     * Gets the rule.
     * @returns object.
     */
    QueryBuilder.prototype.getRule = function (elem) {
        var ruleElem;
        var ruleId;
        var index = 0;
        if (elem instanceof HTMLElement) {
            ruleElem = closest(elem, '.e-rule-container');
        }
        else {
            ruleId = this.element.id + '_' + elem;
            ruleElem = document.getElementById(ruleId);
        }
        var groupElem = closest(ruleElem, '.e-group-container');
        var rule = this.getParentGroup(groupElem);
        while (ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        return rule.rules[index];
    };
    /**
     * Gets the group.
     * @returns object.
     */
    QueryBuilder.prototype.getGroup = function (target) {
        if (target instanceof Element && target.className.indexOf('e-group-container') < 1) {
            target = closest(target, '.e-group-container');
        }
        var groupId = (target instanceof Element) ? target.id : this.element.id + '_' + target;
        var rule = this.getParentGroup(groupId);
        return { rules: rule.rules, condition: rule.condition };
    };
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    QueryBuilder.prototype.deleteGroups = function (groupIdColl) {
        var i;
        var len = groupIdColl.length;
        var groupID;
        for (i = 0; i < len; i++) {
            groupID = this.element.id + '_' + groupIdColl[i];
            this.deleteGroup(document.getElementById(groupID));
        }
    };
    /**
     * return the Query from current rules collection.
     * @returns Promise.
     * @blazorType object
     */
    QueryBuilder.prototype.getFilteredRecords = function () {
        var predicate = this.getPredicate(this.getValidRules(this.rule));
        var dataManagerQuery;
        dataManagerQuery = isNullOrUndefined(predicate) ? new Query() : new Query().where(predicate);
        if (this.isBlazor()) {
            var adaptr = new UrlAdaptor();
            var dm = new DataManager({ url: '', adaptor: new UrlAdaptor });
            var state = adaptr.processQuery(dm, dataManagerQuery);
            var data = JSON.parse(state.data);
            return Object.keys(data).length ? data : null;
        }
        else {
            return this.dataManager.executeQuery(dataManagerQuery);
        }
    };
    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    QueryBuilder.prototype.deleteRules = function (ruleIdColl) {
        var i;
        var len = ruleIdColl.length;
        var ruleID;
        for (i = 0; i < len; i++) {
            ruleID = this.element.id + '_' + ruleIdColl[i];
            this.deleteRule(document.getElementById(ruleID));
        }
    };
    /**
     * Gets the query for Data Manager.
     * @returns string.
     */
    QueryBuilder.prototype.getDataManagerQuery = function (rule) {
        var predicate = this.getPredicate(rule);
        var query;
        var fields = [];
        for (var i = 0, len = Object.keys(this.columns); i < len.length; i++) {
            fields.push(this.columns[i].field);
        }
        if (rule.rules.length) {
            query = new Query().select(fields).where(predicate);
        }
        else {
            query = new Query().select(fields);
        }
        return query;
    };
    /**
     * Get the predicate from collection of rules.
     * @returns null
     */
    QueryBuilder.prototype.getPredicate = function (rule) {
        var ruleColl = rule.rules;
        var pred;
        var pred2;
        var ruleValue;
        var ignoreCase = false;
        var column;
        var ignoreOper = ['notcontains', 'notstartswith', 'notendswith'];
        if (!ruleColl) {
            return pred;
        }
        for (var i = 0, len = ruleColl.length; i < len; i++) {
            var keys = Object.keys(ruleColl[i]);
            ignoreCase = false;
            if (keys.indexOf('rules') > -1 && ruleColl[i].rules) {
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
                var oper = ruleColl[i].operator.toLowerCase();
                var isDateFilter = false;
                var dateOperColl = ['equal', 'notequal', 'greaterthan', 'lessthanorequal'];
                if (ruleColl[i].type === 'string') {
                    ignoreCase = this.matchCase ? false : true;
                }
                if (ruleColl[i].type === 'date' && dateOperColl.indexOf(oper) > -1) {
                    ignoreCase = true;
                }
                column = this.getColumn(ruleColl[i].field);
                if (ruleColl[i].type === 'date' && !(ruleColl[i].value instanceof Array)) {
                    var format = this.getFormat(column.format);
                    ruleValue = this.getDate(ruleColl[i].value, format);
                    if (dateOperColl.indexOf(oper) > -1) {
                        isDateFilter = true;
                    }
                }
                else if (ruleColl[i].operator.indexOf('null') > -1 || ruleColl[i].operator.indexOf('empty') > -1) {
                    ruleColl[i].value = null;
                }
                else {
                    ruleValue = ruleColl[i].value;
                }
                if (i === 0) {
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 || oper.indexOf('null') > -1 ||
                        oper.indexOf('empty') > -1) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i], ruleValue) : this.arrayPredicate(ruleColl[i]);
                    }
                    else {
                        var value = ruleValue;
                        if (value !== '' && ignoreOper.indexOf(oper) < 0) {
                            pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                        }
                    }
                }
                else {
                    if (ignoreOper.indexOf(oper) > -1) {
                        continue;
                    }
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 ||
                        oper.indexOf('null') > -1 || oper.indexOf('empty') > -1) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i], ruleValue, pred, rule.condition) :
                            this.arrayPredicate(ruleColl[i], pred, rule.condition);
                    }
                    else {
                        if (rule.condition === 'and') {
                            var value = ruleValue;
                            if (pred && value !== '') {
                                pred
                                    = pred.and(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                            else if (value !== '') {
                                pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                        }
                        else {
                            var value = ruleValue;
                            if (pred && value !== '') {
                                pred = pred.or(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                            else if (value !== '') {
                                pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                        }
                    }
                }
            }
        }
        return pred;
    };
    QueryBuilder.prototype.getLocale = function () {
        var gregorianFormat = '.dates.calendars.gregorian.days.format.short';
        var localeString = this.locale;
        var cultureObj = getValue('main.' + '' + this.locale + gregorianFormat, cldrData);
        if (!cultureObj) {
            localeString = 'en';
        }
        return localeString;
    };
    QueryBuilder.prototype.getColumn = function (field) {
        var columns = this.columns;
        var column;
        for (var i = 0, iLen = columns.length; i < iLen; i++) {
            if (columns[i].field === field) {
                column = columns[i];
            }
        }
        return column;
    };
    QueryBuilder.prototype.datePredicate = function (ruleColl, value, predicate, condition) {
        var pred;
        var dummyDate = new Date(value.getTime());
        var nextDate = new Date(dummyDate.setDate(dummyDate.getDate() + 1));
        switch (ruleColl.operator) {
            case 'equal':
                pred = new Predicate(ruleColl.field, 'greaterthanorequal', value);
                pred = pred.and(ruleColl.field, 'lessthan', nextDate);
                break;
            case 'notequal':
                pred = new Predicate(ruleColl.field, 'lessthan', value);
                pred = pred.or(ruleColl.field, 'greaterthanorequal', nextDate);
                break;
            case 'greaterthan':
                pred = new Predicate(ruleColl.field, 'greaterthanorequal', nextDate);
                break;
            case 'lessthanorequal':
                pred = new Predicate(ruleColl.field, 'lessthan', nextDate);
                break;
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
    };
    QueryBuilder.prototype.arrayPredicate = function (ruleColl, predicate, condition) {
        var value = ruleColl.value;
        var nullValue = ruleColl.value;
        var format;
        var pred;
        var column = this.getColumn(ruleColl.field);
        format = this.getFormat(column.format);
        if (ruleColl.operator.indexOf('null') > -1 || ruleColl.operator.indexOf('empty') > -1) {
            switch (ruleColl.operator) {
                case 'isnull':
                    pred = new Predicate(ruleColl.field, 'isnull', nullValue);
                    break;
                case 'isnotnull':
                    pred = new Predicate(ruleColl.field, 'notnull', nullValue);
                    break;
                case 'isempty':
                    pred = new Predicate(ruleColl.field, 'equal', '');
                    break;
                case 'isnotempty':
                    pred = new Predicate(ruleColl.field, 'notequal', '');
                    break;
            }
        }
        if (!(ruleColl.operator.indexOf('null') > -1 || ruleColl.operator.indexOf('empty') > -1)) {
            for (var j = 0, jLen = value.length; j < jLen; j++) {
                if (value[j] !== '') {
                    if (j === 0) {
                        switch (ruleColl.operator) {
                            case 'between':
                                if (column.type === 'date') {
                                    pred = new Predicate(ruleColl.field, 'greaterthanorequal', this.getDate(value[j], format));
                                }
                                else {
                                    pred = new Predicate(ruleColl.field, 'greaterthanorequal', value[j]);
                                }
                                break;
                            case 'notbetween':
                                if (column.type === 'date') {
                                    pred = new Predicate(ruleColl.field, 'lessthan', this.getDate(value[j], format));
                                }
                                else {
                                    pred = new Predicate(ruleColl.field, 'lessthan', value[j]);
                                }
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
                                if (column.type === 'date') {
                                    var currDate = this.getDate(value[j], format);
                                    var nextDate = new Date(currDate.setDate(currDate.getDate() + 1));
                                    pred = pred.and(ruleColl.field, 'lessthan', nextDate);
                                }
                                else {
                                    pred = pred.and(ruleColl.field, 'lessthanorequal', value[j]);
                                }
                                break;
                            case 'notbetween':
                                if (column.type === 'date') {
                                    pred = pred.or(ruleColl.field, 'greaterthan', this.getDate(value[j], format));
                                }
                                else {
                                    pred = pred.or(ruleColl.field, 'greaterthan', value[j]);
                                }
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
    };
    QueryBuilder.prototype.getDate = function (value, format) {
        var currDate = this.intl.parseDate(value, format);
        if (value.indexOf(':') > -1 && (value.indexOf('/') < 0 || value.indexOf(',') < 0)) {
            currDate.setDate(new Date().getDate());
        }
        return currDate;
    };
    QueryBuilder.prototype.importRules = function (rule, parentElem, isReset) {
        if (!isReset) {
            parentElem = this.renderGroup(rule.condition, parentElem);
        }
        else {
            if (rule.rules.length > 1) {
                // enable/disable conditions when rule group is added
                var orElem = parentElem.querySelector('.e-btngroup-or');
                var andElem = parentElem.querySelector('.e-btngroup-and');
                orElem.disabled = false;
                andElem.disabled = false;
                if (rule.condition === 'or') {
                    orElem.checked = true;
                }
                else {
                    andElem.checked = true;
                }
            }
            else {
                // enable/disable conditions when rule condition is added
                this.disableRuleCondition(parentElem);
            }
            if (this.enableNotCondition) {
                var tglBtnElem = parentElem.querySelector('.e-qb-toggle');
                if (rule.not) {
                    addClass([tglBtnElem], 'e-active-toggle');
                }
                else {
                    removeClass([tglBtnElem], 'e-active-toggle');
                }
            }
        }
        var ruleColl = rule.rules;
        if (!isNullOrUndefined(ruleColl)) {
            for (var i = 0, len = ruleColl.length; i < len; i++) {
                var keys = Object.keys(ruleColl[i]);
                if (!isNullOrUndefined(ruleColl[i].rules) && keys.indexOf('rules') > -1) {
                    parentElem = this.renderGroup(ruleColl[i].condition, parentElem);
                    parentElem = this.importRules(ruleColl[i], parentElem, true);
                }
                else {
                    this.renderRule(ruleColl[i], parentElem);
                }
            }
        }
        parentElem = closest(parentElem, '.e-rule-list');
        if (parentElem) {
            parentElem = closest(parentElem, '.e-group-container');
        }
        return parentElem;
    };
    QueryBuilder.prototype.renderGroup = function (condition, parentElem) {
        this.addGroupElement(true, parentElem, condition); //Child group
        var element = parentElem.querySelectorAll('.e-group-container');
        return element[element.length - 1];
    };
    QueryBuilder.prototype.renderRule = function (rule, parentElem) {
        if (parentElem.className.indexOf('e-group-container') > -1) {
            this.addRuleElement(parentElem, rule); //Create rule
        }
        else {
            this.addRuleElement(parentElem.querySelector('.e-group-container'), rule); //Create group
        }
    };
    QueryBuilder.prototype.getSqlString = function (rules, enableEscape, queryStr) {
        var isRoot = false;
        if (!queryStr && queryStr !== '') {
            queryStr = '';
            isRoot = true;
        }
        else {
            queryStr += '(';
        }
        var condition = rules.condition;
        if (rules.not) {
            if (isRoot) {
                queryStr += 'not (';
            }
            else {
                queryStr += ' not (';
            }
        }
        for (var j = 0, jLen = rules.rules.length; j < jLen; j++) {
            if (rules.rules[j].rules) {
                queryStr = this.getSqlString(rules.rules[j], enableEscape, queryStr);
            }
            else {
                var rule = rules.rules[j];
                var valueStr = '';
                if (rule.value instanceof Array) {
                    if (rule.operator.indexOf('between') > -1) {
                        if (rule.type === 'date') {
                            valueStr += '"' + rule.value[0] + '" AND "' + rule.value[1] + '"';
                        }
                        else {
                            valueStr += rule.value[0] + ' AND ' + rule.value[1];
                        }
                    }
                    else {
                        if (typeof rule.value[0] === 'string') {
                            valueStr += '("' + rule.value[0] + '"';
                            for (var k = 1, kLen = rule.value.length; k < kLen; k++) {
                                valueStr += ',"' + rule.value[k] + '"';
                            }
                            valueStr += ')';
                        }
                        else {
                            valueStr += '(' + rule.value + ')';
                        }
                    }
                }
                else {
                    if (rule.operator.indexOf('startswith') > -1) {
                        valueStr += '("' + rule.value + '%")';
                    }
                    else if (rule.operator.indexOf('endswith') > -1) {
                        valueStr += '("%' + rule.value + '")';
                    }
                    else if (rule.operator.indexOf('contains') > -1) {
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
                if (rule.operator.indexOf('null') > -1 || (rule.operator.indexOf('empty') > -1)) {
                    if (enableEscape) {
                        rule.field = '`' + rule.field + '`';
                    }
                    queryStr += rule.field + ' ' + this.operators[rule.operator];
                }
                else {
                    if (enableEscape) {
                        rule.field = '`' + rule.field + '`';
                    }
                    queryStr += rule.field + ' ' + this.operators[rule.operator] + ' ' + valueStr;
                }
            }
            if (j !== jLen - 1) {
                queryStr += ' ' + condition + ' ';
            }
        }
        if (!isRoot) {
            queryStr += ')';
        }
        if (rules.not) {
            queryStr += ')';
        }
        return queryStr;
    };
    /**
     * Sets the rules from the sql query.
     */
    QueryBuilder.prototype.setRulesFromSql = function (sqlString) {
        sqlString = sqlString.replace(/`/g, '');
        var ruleModel = this.getRulesFromSql(sqlString);
        this.setRules({ condition: ruleModel.condition, not: ruleModel.not, rules: ruleModel.rules });
    };
    /**
     * Get the rules from SQL query.
     * @returns object.
     */
    QueryBuilder.prototype.getRulesFromSql = function (sqlString) {
        this.parser = [];
        this.sqlParser(sqlString);
        this.rule = { condition: 'and', not: false, rules: [] };
        var rule = this.processParser(this.parser, this.rule, [0]);
        if (this.enableNotCondition) {
            return { condition: rule.condition, not: rule.not, rules: rule.rules };
        }
        else {
            return { condition: rule.condition, rules: rule.rules };
        }
    };
    /**
     * Gets the sql query from rules.
     * @returns object.
     */
    QueryBuilder.prototype.getSqlFromRules = function (rule, allowEscape) {
        rule = this.getRuleCollection(rule, false);
        return this.getSqlString(this.getValidRules(rule), allowEscape).replace(/"/g, '\'');
    };
    QueryBuilder.prototype.sqlParser = function (sqlString) {
        var st = 0;
        var str;
        do {
            str = sqlString.slice(st);
            st += this.parseSqlStrings(str);
        } while (str !== '');
        return this.parser;
    };
    QueryBuilder.prototype.parseSqlStrings = function (sqlString) {
        var operators = ['=', '!=', '<=', '>=', '<', '>'];
        var conditions = ['and', 'or', 'not'];
        var subOp = ['IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL',
            'IS EMPTY', 'IS NOT EMPTY'];
        var regexStr;
        var regex;
        var matchValue;
        for (var i = 0, iLen = operators.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(operators[i]) ? '\\b' : '';
            regex = new RegExp('^(' + operators[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Operators', operators[i].toLowerCase()]);
                return operators[i].length;
            }
        }
        var lastPasrser = this.parser[this.parser.length - 1];
        if (!lastPasrser || (lastPasrser && lastPasrser[0] !== 'Literal')) {
            for (var i = 0, iLen = conditions.length; i < iLen; i++) {
                regexStr = /^\w+$/.test(conditions[i]) ? '\\b' : '';
                regex = new RegExp('^(' + conditions[i] + ')' + regexStr, 'ig');
                if (regex.exec(sqlString)) {
                    this.parser.push(['Conditions', conditions[i].toLowerCase()]);
                    return conditions[i].length;
                }
            }
        }
        for (var i = 0, iLen = subOp.length; i < iLen; i++) {
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
        //Negative Number
        if (/^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            matchValue = /^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        return 1;
    };
    QueryBuilder.prototype.getOperator = function (value, operator) {
        var operators = {
            '=': 'equal', '!=': 'notequal', '<': 'lessthan', '>': 'greaterthan', '<=': 'lessthanorequal',
            '>=': 'greaterthanorequal', 'in': 'in', 'not in': 'notin', 'between': 'between', 'not between': 'notbetween',
            'is empty': 'isempty', 'is null': 'isnull', 'is not null': 'isnotnull', 'is not empty': 'isnotempty'
        };
        if (value.indexOf('%') === 0 && value[value.length - 1] === '%') {
            return (operator === 'not like') ? 'notcontains' : 'contains';
        }
        else if (value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
            return (operator === 'not like') ? 'notstartswith' : 'startswith';
        }
        else if (value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
            return (operator === 'not like') ? 'notendswith' : 'endswith';
        }
        return operators[operator];
    };
    QueryBuilder.prototype.getTypeFromColumn = function (rules) {
        var columnData = this.columns;
        for (var i = 0; i < columnData.length; i++) {
            if (columnData[i].field === rules.field) {
                rules.type = columnData[i].type;
                break;
            }
        }
        return rules.type;
    };
    QueryBuilder.prototype.processParser = function (parser, rules, levelColl) {
        var j;
        var jLen;
        var rule;
        var subRules;
        var numVal = [];
        var strVal = [];
        var k;
        var kLen;
        var l;
        var lLen;
        var grpCount;
        var operator;
        for (var i = 0, iLen = parser.length; i < iLen; i++) {
            if (parser[i][0] === 'Literal') {
                rule = { label: parser[i][1], field: parser[i][1] };
                if (parser[i + 1][0] === 'SubOperators') {
                    if (parser[i + 1][1].indexOf('null') > -1 || parser[i + 1][1].indexOf('empty') > -1) {
                        rule.operator = this.getOperator(' ', parser[i + 1][1]);
                        rule.value = null;
                        rule.type = this.getTypeFromColumn(rule);
                    }
                    else {
                        rule.operator = this.getOperator(parser[i + 3][1].replace(/'/g, ''), parser[i + 1][1]);
                    }
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
                            if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                                break;
                            }
                            if (operator.indexOf('like') > -1 && parser[j][0] === 'String') {
                                rule.value = parser[j][1].replace(/'/g, '').replace(/%/g, '');
                                rule.type = 'string';
                            }
                            else if (operator.indexOf('between') > -1) {
                                if (parser[j][0] === 'Literal' || parser[j][0] === 'Left') {
                                    break;
                                }
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                }
                                else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                            else {
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                }
                                else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                            rule.type = this.getTypeFromColumn(rule);
                        }
                    }
                    if (operator.indexOf('like') < 0) {
                        if (parser[j - 1][0] === 'Number') {
                            rule.value = numVal;
                            rule.type = 'number';
                        }
                        else if (parser[j - 1][0] === 'String') {
                            rule.value = strVal;
                            rule.type = 'string';
                        }
                        else if (operator.indexOf('between') > -1 && parser[j - 1][0] === 'Conditions') {
                            rule.value = numVal;
                            rule.type = 'number';
                        }
                        numVal = [];
                        strVal = [];
                        rule.type = this.getTypeFromColumn(rule);
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
                    rule.type = this.getTypeFromColumn(rule);
                }
                rules.rules.push(rule);
            }
            else if (parser[i][0] === 'Left') {
                if (!(parser[0][0] === 'Left') && parser[i - 1][1] === 'not') {
                    continue;
                }
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                if (this.enableNotCondition) {
                    subRules = { condition: 'and', rules: [], not: false };
                }
                else {
                    subRules = { condition: 'and', rules: [] };
                }
                grpCount = 0;
                kLen = rules.rules.length;
                for (k = 0; k < kLen; k++) { //To get the group position
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
                if (parser[i][1] === 'not') {
                    rules.not = true;
                }
                else {
                    rules.condition = parser[i][1];
                }
            }
            else if (parser[i][0] === 'Right') {
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                levelColl.pop(); //To get the parent Group
                rules = this.rule;
                lLen = levelColl.length;
                for (l = 0; l < lLen; l++) {
                    rules = this.findGroupByIdx(levelColl[l], rules, l === 0);
                }
                return this.processParser(this.parser, rules, levelColl);
            }
        }
        return rules;
    };
    QueryBuilder.prototype.isBlazor = function () {
        return ((Object.keys(window).indexOf('ejsInterop') === -1) ? false : true);
    };
    __decorate([
        Event()
    ], QueryBuilder.prototype, "created", void 0);
    __decorate([
        Event()
    ], QueryBuilder.prototype, "beforeChange", void 0);
    __decorate([
        Event()
    ], QueryBuilder.prototype, "change", void 0);
    __decorate([
        Event()
    ], QueryBuilder.prototype, "ruleChange", void 0);
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
        Property(false)
    ], QueryBuilder.prototype, "matchCase", void 0);
    __decorate([
        Property(0)
    ], QueryBuilder.prototype, "immediateModeDelay", void 0);
    __decorate([
        Property(false)
    ], QueryBuilder.prototype, "enableNotCondition", void 0);
    __decorate([
        Complex({ condition: 'and', rules: [] }, Rule)
    ], QueryBuilder.prototype, "rule", void 0);
    QueryBuilder = __decorate([
        NotifyPropertyChanges
    ], QueryBuilder);
    return QueryBuilder;
}(Component));

/**
 * QueryBuilder modules
 */

/**
 * QueryBuilder all modules
 */

export { Columns, Rule, ShowButtons, QueryBuilder };
//# sourceMappingURL=ej2-querybuilder.es5.js.map
