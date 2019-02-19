/**
 * Query Builder Source
 */
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser } from '@syncfusion/ej2-base';
import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getInstance, addClass, removeClass, rippleEffect, detach, classList } from '@syncfusion/ej2-base';
import { Internationalization, DateFormatOptions } from '@syncfusion/ej2-base';
import { QueryBuilderModel, ShowButtonsModel, ColumnsModel, RulesModel, RuleModel } from './query-builder-model';
import { Button, RadioButton, ChangeEventArgs as ButtonChangeEventArgs } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs, FieldSettingsModel, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { MultiSelect, MultiSelectChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType, Event, EventHandler, getValue, Animation } from '@syncfusion/ej2-base';
import { Query, Predicate, DataManager, Deferred } from '@syncfusion/ej2-data';
import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';
import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs } from '@syncfusion/ej2-calendars';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Tooltip } from '@syncfusion/ej2-popups';
type ReturnType = { result: Object[], count: number, aggregates?: Object };
MultiSelect.Inject(CheckBoxSelection);
export class Columns extends ChildProperty<Columns> {
    /**
     * Specifies the fields in columns.
     * @default null
     */
    @Property(null)
    public field: string;
    /**
     * Specifies the labels name in columns
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the types in columns field
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * Specifies the values in columns or bind the values from sub controls.
     * @default null
     */
    @Property(null)
    public values: string[] | number[];
    /**
     * Specifies the operators in columns.
     * @default null
     */
    @Property(null)
    public operators: { [key: string]: Object }[];
    /**
     * Specifies the template for value field such as slider or any other widgets.
     * @default null
     */
    @Property(null)
    public template: TemplateColumn;
    /**
     * Specifies the validation for columns (text, number and date).
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    @Property({ isRequired: true , min: 0, max: Number.MAX_VALUE })
    public validation: Validation;
    /**
     * Specifies the date format for columns.
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    @Property(null)
    public step: number;
}
export class Rules extends ChildProperty<Rules> {
    /**
     * Specifies the condition value in group.
     * @default 'and'
     */
    @Property('')
    public condition: string;
    /**
     * Specifies the rules in group.
     * @default 'rule'
     */
    @Property()
    public rules: RulesModel[];
    /**
     * Specifies the field value in group.
     * @default null
     */
    @Property(null)
    public field: string;
    /**
     * Specifies the label value in group.
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the type value in group.
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * Specifies the operator value in group.
     * @default null
     */
    @Property(null)
    public operator: string;
    /**
     * Specifies the sub controls value in group.
     * @default null
     */
    @Property(null)
    public value: string[] | number[] | string | number;
}
export class Rule extends ChildProperty<Rule> {
    /**
     * Specifies the condition value in group.
     * @default 'and'
     */
    @Property('and')
    public condition: string;
    /**
     * Specifies the initial rule, which is JSON data.
     * @default 'rule'
     */
    @Property()
    public rules: RulesModel[];
}

export class ShowButtons extends ChildProperty<ShowButtons> {
    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     * @default true
     */
    @Property(true)
    public ruleDelete: boolean;
    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     * @default true
     */
    @Property(true)
    public groupInsert: boolean;
    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
     * @default true
     */
    @Property(true)
    public groupDelete: boolean;
}
/** 
 * Specify Specifies the displayMode as Horizontal or Vertical.
 */
export type DisplayMode =
    /**  Display the Horizontal UI */
    'Horizontal' |
    /**  Display the Vertical UI */
    'Vertical';
/** 
 * Specifies the sort direction of the field names. They are
 * * Default
 * * Ascending
 * * Descending
 */
export type SortDirection =
    /**  Show the field names in default */
    'Default' |
    /**  Show the field names in Ascending */
    'Ascending' |
    /**  Show the field names in Descending */
    'Descending';

@NotifyPropertyChanges

export class QueryBuilder extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    private groupIdCounter: number;
    private ruleIdCounter: number;
    private btnGroupId: number;
    private levelColl: Level;
    private isImportRules: boolean;
    private filterIndex: number;
    private parser: string[][];
    private defaultLocale: Object;
    private l10n: L10n;
    private intl: Internationalization;
    private items: ItemModel[];
    private customOperators: Object;
    private operators: Object;
    private operatorValue: Object;
    private ruleElem: Element;
    private groupElem: Element;
    private dataColl: object[];
    private dataManager: DataManager;
    /** 
     * Triggers when the component is created.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers before the condition (And/Or) is changed.
     * @event
     */
    @Event()
    public beforeConditionChange: EmitType<Object>;
    /**
     * Triggers before the field is changed.
     * @event
     */
    @Event()
    public beforeFieldChange: EmitType<Object>;
    /**
     * Triggers before the operator is changed. (e.g., equal, less etc.).
     * @event
     */
    @Event()
    public beforeOperatorChange: EmitType<Object>;
    /**
     * Triggers before the value is changed.
     * @event
     */
    @Event()
    public beforeValueChange: EmitType<Object>;
    /**
     * Triggers when changing the condition(AND/OR) in button group.
     * @event
     */
    @Event()
    public conditionChanged: EmitType<Object>;
    /**
     * Triggers when changing the fields using the drop-down list.
     * @event
     */
    @Event()
    public fieldChanged: EmitType<Object>;
    /**
     * Triggers when changing the rule value.
     * @event
     */
    @Event()
    public valueChanged: EmitType<Object>;
    /**
     * Triggers when changing the operator value.
     * @event
     */
    @Event()
    public operatorChanged: EmitType<Object>;
    /**
     * Triggers when deleting a group.
     * @event
     */
    @Event()
    public groupDelete: EmitType<Object>;
    /**
     * Triggers when deleting the rule.
     * @event
     */
    @Event()
    public ruleDelete: EmitType<Object>;
    /**
     * Triggers when adding a Group.
     * @event
     */
    @Event()
    public groupInsert: EmitType<Object>;
    /**
     * Triggers when adding the rule.
     * @event
     */
    @Event()
    public ruleInsert: EmitType<Object>;
    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    @Property({ ruleDelete: true, groupInsert: true, groupDelete: true })
    public showButtons: ShowButtonsModel;
    /**
     * Shows or hides the filtered query.
     * @default false
     */
    @Property(false)
    public summaryView: boolean;
    /**
     * Enables or disables the validation.
     * @default false
     */
    @Property(false)
    public allowValidation: boolean;
    /**
     * Specifies columns to create filters.
     * @default {}
     */
    @Property([])
    public columns: ColumnsModel[];
    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     * @default []
     */
    @Property([])
    public dataSource: Object[] | Object | DataManager;
    /**
     * Specifies the displayMode as Horizontal or Vertical.
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public displayMode: DisplayMode;
    /**
     * Enables or disables the RTL support it is extended from the component class.
     * @default false.
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, filter states will be persisted.
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies the sort direction of the field names.
     * @default 'Default'
     */
    @Property('Default')
    public sortDirection: SortDirection;
    /**
     * Specifies the maximum group count or restricts the group count.
     * @default 5
     */
    @Property(5)
    public maxGroupCount: number;
    /**
     * Specifies the height of the query builder.
     * @default 'auto'
     */
    @Property('auto')
    public height: string;
    /**
     * Specifies the width of the query builder.
     * @default 'auto'
     */
    @Property('auto')
    public width: string;
    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     * @default {}
     */
    @Complex<RuleModel>({ condition: 'and', rules: [] }, Rule)
    public rule: RuleModel;

    constructor(options?: QueryBuilderModel, element?: string | HTMLDivElement) {
        super(options, <string | HTMLDivElement>element);
    }

    protected getPersistData(): string {
        return this.addOnPersist(['rule']);
    }
    /**
     * Clears the rules without root rule.
     * @returns void.
     */
    public reset(): void {
        this.isImportRules = false;
        let bodeElem: Element = this.element.querySelector('.e-group-body');
        bodeElem.innerHTML = '';
        bodeElem.appendChild(this.createElement('div', { attrs: { class: 'e-rule-list' } }));
        this.levelColl[this.element.id + '_e_group0'] = [0];
        this.rule = { condition: 'and', rules: [] };
    }
    private getWrapper(): Element {
        return this.element;
    }
    protected getModuleName(): string {
        return 'query-builder';
    }
    private initialize(): void {
        if (this.dataColl.length) {
            let columnKeys: string[] = Object.keys(this.dataColl[0]);
            let cols: ColumnsModel[] = [];
            let type: string;
            let isDate: boolean = false; let value: string | number | boolean | Object;
            let validateObj: Validation = {isRequired: true, min: 0, max: Number.MAX_VALUE};
            if (this.columns.length) {
                this.columnSort();
                let columns: ColumnsModel[] = this.columns;
                for (let i: number = 0, len: number = columns.length; i < len; i++) {
                    if (!columns[i].type) {
                        if (columnKeys.indexOf(columns[i].field) > -1) {
                            value = this.dataColl[0][columns[i].field];
                            type = typeof value;
                            if (type === 'string') {
                                isDate = !isNaN(Date.parse(value as string));
                            } else if (type === 'object') {
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
            } else {
                for (let i: number = 0, len: number = columnKeys.length; i < len; i++) {
                    value = this.dataColl[0][columnKeys[i]];
                    type = typeof value;
                    if (type === 'string') {
                        isDate = !isNaN(Date.parse(value as string));
                    } else if (type === 'object') {
                        isDate = value instanceof Date && !isNaN(value.getTime());
                        type = 'string';
                    }
                    cols[i] = { 'field': columnKeys[i], 'label': columnKeys[i], 'type': isDate ? 'date' : type,
                    'validation': validateObj } as Columns;
                    isDate = false;
                }
                this.columns = cols as Columns[];
            }
        }
    }

    private clickEventHandler(event: MouseEventArgs): void {
        let target: Element = event.target as Element;
        this.isImportRules = false;
        if (target.tagName === 'SPAN') {
            target = target.parentElement;
        }
        if (target.className.indexOf('e-collapse-rule') > -1) {
            let animation: Animation = new Animation({ duration: 1000, delay: 0 });
            let summaryElem: HTMLElement =  document.getElementById(this.element.id + '_summary_content');
            let txtareaElem: HTMLElement = summaryElem.querySelector('.e-summary-text');
            animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
            let groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
            groupElem.style.display = 'none';
            txtareaElem.textContent = this.getSqlFromRules(this.rule);
            summaryElem.style.display = 'block';
            txtareaElem.style.height = txtareaElem.scrollHeight + 'px';
        }
        if (target.tagName === 'BUTTON') {
            if (target.className.indexOf('e-removerule') > -1) {
                if (target.className.indexOf('e-tooltip') > -1) {
                    (getComponent(target as HTMLElement, 'tooltip') as Tooltip).destroy();
                }
                this.deleteRule(target);
            } else if (target.className.indexOf('e-deletegroup') > -1) {
                (getComponent(target as HTMLElement, 'tooltip') as Tooltip).destroy();
                this.deleteGroup(closest(target, '.e-group-container'));
            } else if (target.className.indexOf('e-edit-rule') > -1) {
                let animation: Animation = new Animation({ duration: 1000, delay: 0 });
                animation.animate('.e-query-builder' , { name: 'SlideLeftIn' });
                document.getElementById(this.element.id + '_summary_content').style.display = 'none';
                if (this.element.querySelectorAll('.e-group-container').length < 1) {
                    this.addGroupElement(false, this.element, this.rule.condition);
                    let mRules: RuleModel = extend({}, this.rule, {}, true);
                    this.setGroupRules(mRules);
                    this.renderSummaryCollapse();
                } else {
                    let groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
                    if (groupElem.querySelectorAll('.e-collapse-rule').length < 1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block';
                }
            }
        } else if (target.tagName === 'LABEL' && target.parentElement.className.indexOf('e-btn-group') > -1) {
            let element: Element = closest(target, '.e-group-container');
            let args: { [key: string]: string | Element | boolean } = { groupID: element.id, selectedItem: target, cancel: false };
            this.trigger('beforeConditionChange', args);
            let rule: RuleModel = this.getGroup(element);
            rule.condition = target.textContent.toLowerCase();
            args = { groupID: element.id, selectedItem: target };
            this.trigger('conditionChanged', args);
        }
    }

    private selectBtn(target: Element, event: MenuEventArgs): void {
        if (event.name === 'beforeOpen') {
            if (this.showButtons.groupInsert) {
                removeClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            } else {
                addClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
        } else if (event.element.children[0].className.indexOf('e-addrule') > -1) {
            this.addRuleElement(closest(target, '.e-group-container'), {});
        } else if (event.element.children[0].className.indexOf('e-addgroup') > -1) {
            this.addGroupElement(true, closest(target, '.e-group-container'), '', true);
        }

    }
    private addRuleElement(target: Element, rule?: RulesModel): void {
        let ruleElem: Element = this.ruleElem.cloneNode(true) as Element;
        if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
            ruleElem.className = 'e-rule-container e-vertical-mode';
        } else {
            ruleElem.className = 'e-rule-container e-horizontal-mode';
        }
        let groupLevel: number[]; let rules: RulesModel; let i: number; let len: number;
        let dropDownList: DropDownList;
        let ruleListElem: Element = target.querySelector('.e-rule-list');
        let element: Element = ruleElem.querySelector('button');
        let height: string;
        if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
            element.textContent = this.l10n.getConstant('Remove');
            addClass([element], 'e-flat');
            addClass([element], 'e-primary');
        } else {
            addClass([element], 'e-round');
            addClass([element], 'e-icon-btn');
            let tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteRule') });
            tooltip.appendTo(element as HTMLElement);
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
            dataSource: this.columns as { [key: string]: Object }[], // tslint:disable-line
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
            rules = this.rule as RuleModel;
            for (i = 0, len = groupLevel.length; i < len; i++) {
                rules = this.findGroupByIdx(groupLevel[i], rules, i === 0);
            }
            if (Object.keys(rule).length) {
                rules.rules.push({
                    'field': rule.field, 'type': rule.type, 'label': rule.label, 'operator': rule.operator, value: rule.value
                });
            } else {
                rules.rules.push({ 'field': '', 'type': '', 'label': '', 'operator': '', 'value': '' });
            }
        }
        if (Object.keys(rule).length) {
            this.changeRule(rule, {
                element: dropDownList.element,
                itemData: this.columns[this.filterIndex] as FieldSettingsModel
            } as ChangeEventArgs);
        }
    }
    private renderToolTip(element: HTMLElement): void {
        let tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('ValidationMessage'),
        position: 'BottomCenter', cssClass: 'e-querybuilder-error' });
        tooltip.appendTo(element);
        tooltip.open(element);
    }
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    public validateFields(): boolean {
        let isValid: boolean = true;
        if (this.allowValidation) {
            let i: number; let len: number; let fieldElem: Element; let indexElem: Element; let valArray: string[] | number[] = [];
            let groupElem: Element; let index: number; let dropDownObj: DropDownList; let tempElem: Element; let rule: RuleModel;
            let ruleElemCln: NodeListOf<Element> = this.element.querySelectorAll('.e-rule-container'); let validateRule: Validation;
            for (i = 0, len = ruleElemCln.length; i < len; i++) {
                groupElem = closest(ruleElemCln[i], '.e-group-container');
                rule = this.getGroup(groupElem);
                index = 0;
                indexElem = tempElem = ruleElemCln[i];
                dropDownObj = getComponent(ruleElemCln[i].querySelector('.e-rule-field input.e-control') as HTMLElement, 'dropdownlist');
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
                        valArray = rule.rules[index].value as string[] | number[];
                    }
                    if (isNullOrUndefined(rule.rules[index].value) || rule.rules[index].value === ''
                    || (rule.rules[index].value instanceof Array && valArray.length < 1)) {
                        let valElem: NodeListOf<Element> = tempElem.querySelectorAll('.e-rule-value input.e-control');
                        isValid = false; let j: number = 0;
                        for (let j: number = 0, jLen: number = valElem.length; j < jLen; j++) {
                            let element: Element = valElem[j]; let elem: Element;
                            if (element.parentElement.className.indexOf('e-searcher') > -1) {
                                elem = closest(element, '.e-multi-select-wrapper');
                                if (elem.className.indexOf('e-tooltip') < 0) {
                                    this.renderToolTip(elem as HTMLElement);
                                }
                            } else if (valElem[j].parentElement.className.indexOf('e-tooltip') < 0) {
                                this.renderToolTip(valElem[j].parentElement);
                            }
                            j++;
                        }
                    }
                } else if (dropDownObj.element && isNullOrUndefined(dropDownObj.index)) {
                    if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                        this.renderToolTip(fieldElem.parentElement);
                    }
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    private groupTemplate(): Element {
        let groupElem: Element; let grpBodyElem: Element; let groupHdrElem: Element;
        let rulesElem: Element; let glueElem: Element; let inputElem: Element;
        let labelElem: Element; let grpActElem: Element; let groupBtn: HTMLElement;
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

    private ruleTemplate(): Element {
        let ruleElem: Element; let filterElem: Element; let tempElem: Element; let delBtnElem: HTMLElement; let fieldElem: Element;
        let clsName: string;
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
        } else {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small e-button-hide';
        }
        delBtnElem = this.createElement('button', { attrs: { class: clsName } });
        tempElem.appendChild(delBtnElem);
        fieldElem.appendChild(tempElem);
        ruleElem.appendChild(fieldElem);
        return ruleElem;
    }
    private addGroupElement(isGroup: boolean, target: Element, condition?: string, isBtnClick?: boolean): void {
        if (this.element.querySelectorAll('.e-group-container').length >= this.maxGroupCount) {
            return;
        }
        let dltGroupBtn: HTMLElement;
        let groupElem: Element = this.groupElem.cloneNode(true) as Element;
        groupElem.setAttribute('id', this.element.id + '_e_group' + this.groupIdCounter);
        this.groupIdCounter++;
        let andInpElem: Element = groupElem.querySelector('.e-btngroup-and');
        let orInpElem: Element = groupElem.querySelector('.e-btngroup-or');
        let andLblElem: Element = groupElem.querySelector('.e-btngroup-and-lbl');
        let orLblElem: Element = groupElem.querySelector('.e-btngroup-or-lbl');
        andInpElem.setAttribute('id', this.element.id + '_and' + this.btnGroupId);
        orInpElem.setAttribute('id', this.element.id + '_or' + this.btnGroupId);
        andInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
        orInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
        andLblElem.setAttribute('for', this.element.id + '_and' + this.btnGroupId);
        orLblElem.setAttribute('for', this.element.id + '_or' + this.btnGroupId);
        this.btnGroupId++;
        if (isGroup) {
            let clsName: string = this.showButtons.groupDelete ? 'e-deletegroup' : 'e-deletegroup e-button-hide';
            dltGroupBtn = this.createElement('button', { attrs: { class: clsName } });
            let button: Button = new Button({ iconCss: 'e-icons e-delete-icon', cssClass: 'e-small e-round' });
            button.appendTo(dltGroupBtn);
            let tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteGroup') });
            tooltip.appendTo(dltGroupBtn as HTMLElement);
            rippleEffect(dltGroupBtn, { selector: '.deletegroup' });
            groupElem.querySelector('.e-group-action').appendChild(dltGroupBtn);
            let ruleList: Element = target.querySelector('.e-rule-list');
            let grpLen: number = target.querySelectorAll('.e-group-container').length;
            ruleList.appendChild(groupElem);
            let level: number[] = this.levelColl[target.id].slice(0);
            level.push(grpLen);
            this.levelColl[groupElem.id] = level;
            if (!this.isImportRules) {
                this.addGroups([], target.id);
                if (isBtnClick) {
                    this.addRuleElement(groupElem, {});
                }
            }
        } else {
            target.appendChild(groupElem);
            this.levelColl[groupElem.id] = [0];
        }
        groupElem.querySelector('.e-btngroup-and').setAttribute('checked', 'true');
        if (condition === 'or') {
            groupElem.querySelector('.e-btngroup-or').setAttribute('checked', 'true');
        }
        let groupBtn: HTMLElement = groupElem.querySelector('.e-add-btn') as HTMLElement;
        let btnObj: DropDownButton = new DropDownButton({
            items: this.items,
            cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
            iconCss: 'e-icons e-add-icon',
            beforeOpen: this.selectBtn.bind(this, groupBtn),
            select: this.selectBtn.bind(this, groupBtn)
        });
        btnObj.appendTo(groupBtn);
        rippleEffect(groupBtn, { selector: '.e-round' });
    }
    public notifyChange(value: string | number | boolean | Date | string[] | number[] | Date[], element: Element): void {
        let tempColl: NodeListOf<Element> = closest(element, '.e-rule-value').querySelectorAll('.e-template');
        let valueColl: string[] = [];
        for (let i: number = 0, iLen: number = tempColl.length; i < iLen; i++) {
            if (tempColl[i].nextElementSibling) {
                if (tempColl[i].nextElementSibling.className.indexOf('e-check') > -1) {
                    valueColl.push(tempColl[i].textContent);
                }
            }
        }
        this.updateRules(element, (tempColl.length > 1) ? valueColl : value);
    }

    private changeValue(i: number, args: ButtonChangeEventArgs | InputEventArgs | InputChangeEventArgs | CalendarChangeEventArgs): void {
        let eventsArgs: { [key: string]: string | number | Date | boolean | string[] };
        let element: Element;
        if (args.event) {
            element = args.event.target as Element;
        } else {
            let multiSelectArgs: MultiSelectChangeEventArgs = args as MultiSelectChangeEventArgs;
            element = multiSelectArgs.element as Element;
        }
        if (element.className.indexOf('e-day') > -1) {
            let calenderArgs: CalendarChangeEventArgs = args as CalendarChangeEventArgs;
            element = calenderArgs.element;
        }
        let groupElem: Element = closest(element, '.e-group-container');
        let ruleElem: Element = closest(element, '.e-rule-container');
        let dateElement: CalendarChangeEventArgs = args as CalendarChangeEventArgs;
        if (dateElement.element && dateElement.element.className.indexOf('e-datepicker') > -1) {
            element = dateElement.element;
        }
        let value: string | number | Date | boolean | string[];
        if (element.className.indexOf('e-radio') > -1) {
            value = (getComponent(element as HTMLElement, 'radio') as RadioButton).label;
        } else if (element.className.indexOf('e-multiselect') > -1) {
            value = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect).value as string[];
        } else {
            value = (<InputEventArgs | InputChangeEventArgs | CalendarChangeEventArgs>args).value;
        }
        eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: value, cancel: false };
        this.trigger('beforeValueChange', eventsArgs);
        this.updateRules(element, value, i);
        eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: value, cancel: false };
        this.trigger('valueChanged', eventsArgs);
    }

    private changeField(args: ChangeEventArgs): void {
        if (args.isInteracted) {
            let groupElem: Element = closest(args.element, '.e-group-container');
            let rules: RuleModel = this.getGroup(groupElem);
            let ruleElem: Element = closest(args.element, '.e-rule-container');
            let index: number = 0;
            while (ruleElem && ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            this.changeRule(rules.rules[index], args);
        }
    }

    private changeRule(rule: RulesModel, args: ChangeEventArgs): void {
        if (!args.itemData) {
            return;
        }
        let tempRule: RulesModel = {}; let ddlObj: DropDownList; let inOperator: string [] = ['in', 'notin'];
        let operatorList: { [key: string]: Object }[]; let betweenOperator: string [] = ['between', 'notbetween'];
        let filterElem: Element; let operatorElem: Element; let oprElem: Element;
        let prevOper: string = rule.operator ? rule.operator.toLowerCase() : '';
        filterElem = closest(args.element, '.e-rule-filter');
        operatorElem = closest(args.element, '.e-rule-operator');
        let dropDownObj: DropDownList = getComponent(args.element, 'dropdownlist') as DropDownList;
        let element: Element = closest(args.element, '.e-group-container');
        if (filterElem) {
            let ruleElem: Element = closest(filterElem, '.e-rule-container');
            let eventsArgs: { [key: string]: string | Element | boolean } = {
                groupID: element.id, ruleID: ruleElem.id, selectedItem: args.item, cancel: false
            };
            this.trigger('beforeFieldChange', eventsArgs);
            tempRule.type = this.columns[dropDownObj.index].type;
            if (ruleElem.querySelector('.e-template')) {
                rule.value = '';
            }
        }
        if (operatorElem) {
            let ruleElem: Element = closest(operatorElem, '.e-rule-container');
            let eventsArgs: { [key: string]: string | Element | boolean } = {
                groupID: element.id, ruleID: ruleElem.id, selectedItem: args.item, cancel: false
            };
            this.trigger('beforeOperatorChange', eventsArgs);
            tempRule.operator = args.itemData.value;
            let currOper: string = tempRule.operator.toLowerCase();
            if (inOperator.indexOf(currOper) > -1 || betweenOperator.indexOf(currOper) > -1) {
                filterElem = operatorElem.previousElementSibling;
                tempRule.type = rule.type;
                if (!(inOperator.indexOf(currOper) > -1 && inOperator.indexOf(prevOper) > -1) &&
                    !(betweenOperator.indexOf(currOper) > -1 && betweenOperator.indexOf(prevOper) > -1)) {
                    rule.value = [];
                }
            } else if (typeof rule.value === 'object') {
                rule.value = rule.value.length > 0 ? rule.value[0] : '';
            }
            if (args.previousItemData) {
                let prevValue: string = args.previousItemData.value.toLowerCase();
                if (prevValue.indexOf('between') > -1 || (prevValue.indexOf('in') > -1 && prevValue.indexOf('contains') < 0)) {
                    filterElem = operatorElem.previousElementSibling; tempRule.type = rule.type;
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
                ddlObj = getComponent(operatorElem.querySelector('.e-dropdownlist') as HTMLElement, 'dropdownlist') as DropDownList;
                tempRule.operator = ddlObj.value as string;
                this.renderValues(
                    operatorElem, args.itemData as ColumnsModel, args.previousItemData as ColumnsModel, true, rule, tempRule, args.element);
            } else {
                let ruleId: string = closest(operatorElem, '.e-rule-container').id;
                oprElem = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_operatorkey' } });
                operatorElem.appendChild(oprElem);
                if (this.columns[dropDownObj.index].operators) {
                    operatorList = this.columns[dropDownObj.index].operators;
                } else if (args.itemData) {
                    operatorList = this.customOperators[this.columns[dropDownObj.index].type + 'Operator'];
                }
                let height: string = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
                let dropDownList: DropDownList = new DropDownList({
                    dataSource: operatorList,
                    fields: { text: 'key', value: 'value' },
                    placeholder: this.l10n.getConstant('SelectOperator'),
                    popupHeight: ((operatorList.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this),
                    index: 0,
                    value: rule ? rule.operator : null
                });
                dropDownList.appendTo('#' + ruleId + '_operatorkey');
                tempRule.operator = (rule && rule.operator !== '') ? rule.operator : operatorList[0].value as string;
                if (this.isImportRules) {
                    tempRule.type = this.columns[dropDownObj.index].type;
                    tempRule.operator = rule.operator;
                }
                this.renderValues(
                    operatorElem, this.columns[dropDownObj.index], args.previousItemData as ColumnsModel,
                    false, rule, tempRule, args.element);
            }
        }
        if (!this.isImportRules) {
            this.updateRules(args.element, args.item);
        }
    }
    // tslint:disable-next-line:no-any
    private destroyControls(target: Element): void {
        let inputElement: NodeListOf<HTMLElement>;
        inputElement = target.nextElementSibling.querySelectorAll('input.e-control') as NodeListOf<HTMLElement>;
        let divElement: NodeListOf<HTMLElement>;
        divElement = target.nextElementSibling.querySelectorAll('div.e-control:not(.e-handle)');
        let columns: ColumnsModel[] = this.columns;
        for (let i: number = 0, len: number = inputElement.length; i < len; i++) {
            if (inputElement[i].classList.contains('e-textbox')) {
                (getComponent(inputElement[i], 'textbox') as TextBox).destroy();
                detach(target.nextElementSibling.querySelector('input#' + inputElement[i].id));
            } else if (inputElement[i].classList.contains('e-dropdownlist')) {
                (getComponent(inputElement[i], 'dropdownlist') as DropDownList).destroy();
            } else if (inputElement[i].classList.contains('e-radio')) {
                (getComponent(inputElement[i], 'radio') as RadioButton).destroy();
            } else if (inputElement[i].classList.contains('e-numerictextbox')) {
                (getComponent(inputElement[i], 'numerictextbox') as NumericTextBox).destroy();
                detach(target.nextElementSibling.querySelector('input#' + inputElement[i].id));
            } else if (inputElement[i].classList.contains('e-datepicker')) {
                (getComponent(inputElement[i], 'datepicker') as DatePicker).destroy();
            } else if (inputElement[i].classList.contains('e-multiselect')) {
                (getComponent(inputElement[i], 'multiselect') as MultiSelect).destroy();
            } else if (inputElement[i].className.indexOf('e-template') > -1) {
                let clsName: string = inputElement[i].className;
                for (let j: number = 0, jLen: number = columns.length; j < jLen; j++) {
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
        for (let i: number = 0, len: number = divElement.length; i < len; i++) {
            if (divElement[i].className.indexOf('e-template') > -1) {
                let clsName: string = divElement[i].className;
                for (let j: number = 0, jLen: number = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], divElement[i].id);
                        break;
                    }
                }
            }
            detach(divElement[i]);
        }
    }
    private templateDestroy(column: ColumnsModel, elemId: string): void {
        let temp: Function = column.template.destroy as Function;
        if (column.template && column.template.destroy) {
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
                temp({ elementId: elemId });
            } else {
                (column.template.destroy as Function)({ elementId: elemId });
            }
        }
    }
    private getDistinctValues(dataSource: object[], field: string): object[] {
        let original: object = {};
        let result: object[] = [];
        for (let i: number = 0, iLen: number = dataSource.length; i < iLen; i++) {
            let value: string = dataSource[i][field];
            if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                value = dataSource[i][field].toString();
            }
            let data: object = {};
            if (!(value in original)) {
                original[value] = 1;
                data[field] = value;
                result.push(data);
            }
        }
        return result;
    }
    private renderMultiSelect(rule: RulesModel, parentId: string, i: number, selectedValue: string[] | number[]): void {
        let ds: object[] = this.getDistinctValues(this.dataColl, rule.field);
        let multiSelectObj: MultiSelect = new MultiSelect({
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
    private processTemplate(target: Element, itemData: ColumnsModel, rule: RulesModel, tempRule: RulesModel): void {
        let tempElements: NodeListOf<Element> = closest(target, '.e-rule-container').querySelectorAll('.e-template');
        if (tempElements.length < 2) {
            if (itemData.template && typeof itemData.template.write === 'string') {
                getValue(itemData.template.write, window)({ elements: tempElements[0], values: rule.value, operator: tempRule.operator });
            } else if (itemData.template && itemData.template.write) {
                (itemData.template.write as Function)({ elements: tempElements[0], values: rule.value, operator: tempRule.operator });
            }
        } else {
            if (itemData.template && typeof itemData.template.write === 'string') {
                getValue(itemData.template.write, window)({ elements: tempElements, values: rule.value, operator: tempRule.operator });
            } else if (itemData.template && itemData.template.write) {
                (itemData.template.write as Function)({ elements: tempElements, values: rule.value, operator: tempRule.operator });
            }
        }
    }
    private renderStringValue(parentId: string, rule: RulesModel, operator: string, idx: number, ruleValElem: HTMLElement): void {
        let selectedVal: string[];
        let selectedValue: string = this.isImportRules ? rule.value as string : '';
        if ((operator === 'in' || operator === 'notin') && this.dataColl.length) {
            selectedVal = this.isImportRules ? rule.value as string[] : [];
            this.renderMultiSelect(rule, parentId, idx, selectedVal);
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleValElem.style.width = '100%';
            } else {
                ruleValElem.style.width = null;
                ruleValElem.style.minWidth = '200px';
            }
        } else {
            if (operator === 'in' || operator === 'notin') {
                selectedVal = this.isImportRules ? rule.value as string[] : [];
                selectedValue = selectedVal.join(',');
            }
            let inputobj: TextBox = new TextBox({
                placeholder: 'Value',
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selectedValue;
            inputobj.dataBind();
        }
    }
    private renderNumberValue(
        parentId: string, rule: RulesModel, operator: string, idx: number, ruleValElem: HTMLElement, itemData: ColumnsModel,
        length: number): void {
        let selectedValue: number = this.isImportRules ? rule.value as number : 0;
        let selectedVal: number[];
        if ((operator === 'in' || operator === 'notin') && this.dataColl.length) {
            selectedVal = this.isImportRules ? rule.value as number[] : [];
            this.renderMultiSelect(rule, parentId, idx, selectedVal);
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                ruleValElem.style.width = '100%';
            } else {
                ruleValElem.style.minWidth = '200px';
                ruleValElem.style.width = null;
            }
        } else if (operator === 'in' || operator === 'notin') {
            selectedVal = this.isImportRules ? rule.value as number[] : [];
            let selVal: string = selectedVal.join(',');
            let inputobj: TextBox = new TextBox({
                placeholder: 'Value',
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selVal;
            inputobj.dataBind();
        } else {
            let fieldObj: DropDownList = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist') as DropDownList;
            itemData = this.columns[fieldObj.index];
            let min: number = (itemData.validation && itemData.validation.min) ? itemData.validation.min : 0;
            let max: number =
                (itemData.validation && itemData.validation.max) ? itemData.validation.max : Number.MAX_VALUE;
            let format: string = itemData.format ? itemData.format : '#';
            if (length > 1 && rule) {
                selectedValue = rule.value[idx] ? rule.value[idx] : 0;
            }
            let numeric: NumericTextBox = new NumericTextBox({
                value: selectedValue as number,
                format: format, min: min, max: max, width: '100%',
                step: itemData.step ? itemData.step : 1,
                change: this.changeValue.bind(this, idx)
            });
            numeric.appendTo('#' + parentId + '_valuekey' + idx);
        }
    }
    private processValueString(value: string, type: string): string[] | number[] {
        let numArr: number[] = []; let strArr: string[] = value.split(',');
        if (type === 'string') {
            return strArr;
        } else {
            for (let k: number = 0, kLen: number = strArr.length; k < kLen; k++) {
                numArr.push(Number(strArr[k]));
            }
            return numArr;
        }
    }
    private renderControls(target: Element, itemData: ColumnsModel, rule: RulesModel, tempRule: RulesModel): void {
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-value');
        if (itemData.template) {
            this.processTemplate(target, itemData, rule, tempRule);
        } else {
            let length: number = (tempRule.type === 'boolean' ||
                tempRule.operator && tempRule.operator.toLowerCase().indexOf('between') > -1) ? 2 : 1;
            let parentId: string = closest(target, '.e-rule-container').id; let ruleValElem: HTMLElement;
            if (target.className.indexOf('e-rule-operator') > -1 || target.className.indexOf('e-rule-filter') > -1) {
                ruleValElem = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    ruleValElem.style.width = '100%';
                } else {
                    if (tempRule.operator !== 'in' && tempRule.operator !== 'notin') {
                        ruleValElem.style.width = '200px';
                    }
                }
                for (let i: number = 0; i < length; i++) {
                    switch (tempRule.type) {
                        case 'string': {
                            this.renderStringValue(parentId, rule, tempRule.operator, i, ruleValElem);
                        }
                            break;
                        case 'number': {
                            this.renderNumberValue(parentId, rule, tempRule.operator, i, ruleValElem, itemData, length);
                        }
                            break;
                        case 'boolean': {
                            let values: string[] =
                                itemData.values && itemData.values.length ? itemData.values as string[] : ['True', 'False'];
                            let isCheck: boolean = this.isImportRules ? Boolean(rule.value) : true;
                            let radiobutton: RadioButton = new RadioButton({
                                label: values[i], name: parentId + 'default', checked: isCheck,
                                change: this.changeValue.bind(this, i)
                            });
                            radiobutton.appendTo('#' + parentId + '_valuekey' + i);
                        }
                            break;
                        case 'date': {
                            let selectedValue: Date = new Date(); let selVal: string;
                            if (this.isImportRules && rule && rule.value) {
                                selectedValue = (length > 1) ? new Date(rule.value[i] as string) : new Date(rule.value as string);
                                let format: DateFormatOptions;
                                let column: ColumnsModel = this.getColumn(rule.field);
                                selVal = (length > 1) ? rule.value[i] as string : rule.value as string;
                                format = { type: 'dateTime', format: column.format || 'MM/dd/yyyy' } as DateFormatOptions;
                                selectedValue = this.intl.parseDate(selVal, format) as Date;
                            }
                            let format: string = itemData.format ? itemData.format : 'MM/dd/yyyy';
                            let datepick: DatePicker = new DatePicker({
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
    private renderValues(
        target: Element, itemData: ColumnsModel, prevItemData: ColumnsModel, isRender: boolean, rule: RulesModel,
        tempRule: RulesModel, element: Element): void {
        if (isRender) {
            let ddlObj: DropDownList = getComponent(target.querySelector('input'), 'dropdownlist') as DropDownList;
            if (itemData.operators) {
                ddlObj.dataSource = itemData.operators;
                ddlObj.index = ddlObj.index !== 0 ? 0 : 1;
                ddlObj.dataBind();
                tempRule.operator = ddlObj.value as string;
            } else if (itemData.type) {
                ddlObj.dataSource = this.customOperators[itemData.type + 'Operator'];
                ddlObj.index = ddlObj.index !== 0 ? 0 : 1;
                ddlObj.dataBind();
                tempRule.operator = ddlObj.value as string;
            }
        }
        let parentId: string = closest(target, '.e-rule-container').id;
        if (prevItemData && prevItemData.template) {
            this.templateDestroy(prevItemData, parentId + '_valuekey0');
            detach(target.nextElementSibling.querySelector('#' + parentId + '_valuekey0'));
        }
        if (isRender) {
            this.destroyControls(target);
        }
        let filtElem: HTMLElement = document.getElementById(element.id.replace('operatorkey', 'filterkey'));
        let filtObj: DropDownList = getComponent(filtElem, 'dropdownlist') as DropDownList;
        itemData.template = this.columns[filtObj.index].template;
        if (itemData.template) {
            itemData.template = this.columns[filtObj.index].template;
            let valElem: Element | Element[];
            if (itemData.template && typeof itemData.template.create === 'string') {
                valElem = getValue(itemData.template.create, window)();
            } else if (itemData.template && itemData.template.create) {
                valElem = (itemData.template.create as Function)();
            }
            if (valElem instanceof Element) {
                valElem.id = parentId + '_valuekey0';
                addClass([valElem], 'e-template');
                addClass([valElem], 'e-' + itemData.field);
                target.nextElementSibling.appendChild(valElem);
            } else if (valElem instanceof Array) {
                addClass(valElem, 'e-template');
                for (let i: number = 0, iLen: number = valElem.length; i < iLen; i++) {
                    valElem[i].id = parentId + '_valuekey' + i;
                    target.nextElementSibling.appendChild(valElem[i]);
                }
            }
            let parentElem: HTMLElement = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                parentElem.style.width = '100%';
            } else {
                parentElem.style.minWidth = '200px';
            }
        } else {
            if (tempRule.type === 'boolean' || tempRule.operator && tempRule.operator.toLowerCase().indexOf('between') > -1) {
                for (let i: number = 0; i < 2; i++) {
                    let valElem: HTMLElement;
                    valElem = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey' + i } });
                    target.nextElementSibling.appendChild(valElem);
                }
            } else {
                let valElem: HTMLElement = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey0' } });
                target.nextElementSibling.appendChild(valElem);
            }
        }
        this.renderControls(target, itemData, rule, tempRule);
    }
    private updateValues(element: HTMLElement, rule: RulesModel): void {
        let controlName: string = element.className.split(' e-')[1];
        let i: number = parseInt(element.id.slice(-1), 2) as number;
        switch (controlName) {
            case 'textbox':
                rule.value = (getComponent(element, controlName) as TextBox).value;
                break;
            case 'dropdownlist':
                rule.value = (getComponent(element, controlName) as DropDownList).value as string;
                break;
            case 'radio':
                rule.value = (getComponent(element, controlName) as RadioButton).value;
                break;
            case 'numerictextbox':
                if (rule.operator.indexOf('between') > -1) {
                    rule.value[i] = (getComponent(element, controlName) as NumericTextBox).value;
                } else {
                    rule.value = (getComponent(element, controlName) as NumericTextBox).value;
                }
                break;
            case 'datepicker':
                let column: ColumnsModel = this.getColumn(rule.field);
                let format: DateFormatOptions = { type: 'dateTime', format: column.format || 'MM/dd/yyyy' } as DateFormatOptions;
                if (rule.operator.indexOf('between') > -1) {
                    rule.value[i] = (getComponent(element, controlName) as DatePicker).value;
                } else {
                    rule.value = this.intl.formatDate((getComponent(element, controlName) as DatePicker).value, format);
                }
                break;
        }

    }
    private updateRules(
        target: Element, selectedValue: string | number | Date | boolean | string[] | number[] | Date[] | Element, i?: number): void {
        let groupElem: Element = closest(target, '.e-group-container'); let rule: RuleModel = this.getGroup(groupElem);
        let ruleElem: Element = closest(target, '.e-rule-container'); let index: number = 0; let dropDownObj: DropDownList;
        let eventsArgs: { [key: string]: string | Element | boolean };
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        ruleElem = closest(target, '.e-rule-container');
        if (closest(target, '.e-rule-filter')) {
            dropDownObj = getComponent(target as HTMLElement, 'dropdownlist') as DropDownList;
            rule.rules[index].field = this.columns[dropDownObj.index].field; rule.rules[index].type = this.columns[dropDownObj.index].type;
            rule.rules[index].label = this.columns[dropDownObj.index].label;
            let ruleElement: Element = closest(target, '.e-rule-filter');
            let element: HTMLElement = ruleElement.nextElementSibling.querySelector('input.e-control') as HTMLElement;
            let operator: string = (getComponent(element, 'dropdownlist') as DropDownList).value as string;
            rule.rules[index].operator = operator;
            element = ruleElement.nextElementSibling.nextElementSibling.querySelector('input.e-control') as HTMLElement;
            if (!element) {
                element = ruleElement.nextElementSibling.nextElementSibling.querySelector('div.e-control') as HTMLElement;
            }
            eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, selectedItem: selectedValue as Element, cancel: false };
            this.updateValues(element, rule.rules[index]); this.trigger('fieldChanged', eventsArgs);
            if (this.allowValidation && rule.rules[index].field && target.parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(target.parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
        } else if (closest(target, '.e-rule-operator')) {
            dropDownObj = getComponent(target as HTMLElement, 'dropdownlist') as DropDownList;
            rule.rules[index].operator = dropDownObj.value as string;
            let inputElem: NodeListOf<HTMLElement>; let parentElem: HTMLElement = target.parentElement;
            inputElem = ruleElem.querySelectorAll('.e-rule-value input.e-control') as NodeListOf<HTMLElement>;
            eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, selectedItem: selectedValue as Element, cancel: false };
            if (this.allowValidation && rule.rules[index].operator && target.parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(target.parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            if (inputElem.length > 1) {
                rule.rules[index].value = [];
            }
            for (let i: number = 0; i < inputElem.length; i++) {
                this.updateValues(inputElem[i], rule.rules[index]);
            }
            this.trigger('operatorChanged', eventsArgs);
        } else if (closest(target, '.e-rule-value')) {
            this.ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i);
        }
    }
    private ruleValueUpdate(
        target: Element, selectedValue: string | number | Date | boolean | string[] | number[] | Date[] | Element,
        rule: RuleModel, index: number, groupElem: Element, ruleElem: Element, i: number): void {
        let eventsArgs: { [key: string]: string | Element | boolean };
        let arrOperator: string [] = ['in', 'between'];
        if (selectedValue !== null) {
            let oper: string = rule.rules[index].operator.toLowerCase();
            if (target.className.indexOf('e-multiselect') > -1 && rule.rules[index].type === 'number') {
                let selVal: number[] = []; let dupSelectedValue: string[] | number[] = selectedValue as number[] | string[];
                for (let k: number = 0, kLen: number = dupSelectedValue.length; k < kLen; k++) {
                    if (typeof dupSelectedValue[k] === 'string') {
                        selVal.push(parseFloat(dupSelectedValue[k] as string) as number);
                    }
                }
                if (selVal.length) {
                    selectedValue = selVal as number[];
                }
            }
            if (target.className.indexOf('e-template') > -1) {
                if (selectedValue instanceof Array) {
                    if (arrOperator.indexOf(oper) > -1) {
                        rule.rules[index].value = selectedValue as string | number | string[] | number[];
                    } else {
                        rule.rules[index].value = selectedValue[0] as string | number;
                    }
                } else {
                    rule.rules[index].value = selectedValue as string | number | string[] | number[];
                }
                eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, selectedItem: selectedValue as Element, cancel: false };
                this.trigger('valueChanged', eventsArgs);
            } else if (target.className.indexOf('e-spin') > -1 || target.className.indexOf('e-numeric') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    rule.rules[index].value[i] = selectedValue as string | number;
                } else {
                    rule.rules[index].value = selectedValue as string | number;
                }
            } else if (target.className.indexOf('e-radio') > -1) {
                rule.rules[index].value = selectedValue as string | number;
            } else if (target.className.indexOf('e-multiselect') > -1) {
                rule.rules[index].value = selectedValue as string[];
            } else if (target.className.indexOf('e-textbox') > -1) {
                if (oper === 'in' || oper === 'notin') {
                    if (rule.rules[index].type === 'string') {
                        rule.rules[index].value = this.processValueString(selectedValue as string, rule.rules[index].type) as string[];
                    } else {
                        rule.rules[index].value = this.processValueString(selectedValue as string, rule.rules[index].type) as number[];
                    }
                } else {
                    rule.rules[index].value = selectedValue as string | number;
                }
            } else if (target.className.indexOf('e-datepicker') > -1) {
                let ddlInst: DropDownList =
                    getInstance(ruleElem.querySelector('.e-rule-filter input') as HTMLElement, DropDownList) as DropDownList;
                let format: DateFormatOptions =
                    { type: 'dateTime', format: this.columns[ddlInst.index].format || 'MM/dd/yyyy' } as DateFormatOptions;
                if ((<DateFormatOptions>format).type) {
                    if (arrOperator.indexOf(oper) > -1) {
                        rule.rules[index].value[i] = this.intl.formatDate(selectedValue as Date, format);
                    } else {
                        rule.rules[index].value = this.intl.formatDate(selectedValue as Date, format);
                    }
                }
            }
            this.validatValue(rule, index, ruleElem);
        }
    }
    private validatValue(rule: RuleModel, index: number, ruleElem: Element): void {
        if (this.allowValidation && rule.rules[index].value) {
            let valElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-rule-value .e-control');
            if (valElem[0].className.indexOf('e-tooltip') > -1) {
                (getComponent(valElem[0] as HTMLElement, 'tooltip') as Tooltip).destroy();
            } else if (valElem[0].parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(valElem[0].parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            if (valElem[1] && valElem[1].parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(valElem[1].parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
        }

    }
    private findGroupByIdx(groupIdx: number, rule: RuleModel, isRoot: boolean): RulesModel {
        let ruleColl: RulesModel[] = rule.rules;
        if (!isRoot && ruleColl[groupIdx]) {
            rule = ruleColl[groupIdx];
            if (rule.rules) {
                return rule;
            } else {
                for (let j: number = groupIdx + 1, jLen: number = ruleColl.length; j < jLen; j++) {
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
    public destroy(): void {
        let queryElement: Element = this.element;
        if (!queryElement) { return; }
        let element: NodeListOf<HTMLElement>; let i: number; let len: number;
        super.destroy();
        element = this.element.querySelectorAll('.e-addrulegroup') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i], 'dropdown-btn') as DropDownButton).destroy();
            detach(element[i]);
        }
        element = this.element.querySelectorAll('.e-rule-filter .e-control') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i], 'dropdownlist') as DropDownList).destroy();
            detach(element[i]);
        }
        element = this.element.querySelectorAll('.e-rule-operator .e-control') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i], 'dropdownlist') as DropDownList).destroy();
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
    public addRules(rule: RulesModel[], groupID: string): void {
        let args: { [key: string]: string } = { groupID: groupID };
        for (let i: number = 0, len: number = rule.length; i < len; i++) {
            this.addRuleElement(document.getElementById(groupID), rule[i]);
        }
        this.trigger('ruleInsert', args);
    }
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    public addGroups(groups: RuleModel[], groupID: string): void {
        let groupElem: Element = document.getElementById(groupID);
        let rule: RuleModel = this.getGroup(groupElem); let grouplen: number = groups.length;
        let args: { [key: string]: string } = { groupID: groupID };
        if (grouplen) {
            for (let i: number = 0, len: number = groups.length; i < len; i++) {
                this.importRules(groups[i], groupElem);
            }
        } else {
            rule.rules.push({ 'condition': 'and', rules: [] });
        }
        this.trigger('groupInsert', args);
    }
    private initWrapper(): void {
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
        } else {
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
        } else {
            this.displayMode = 'Horizontal';
        }
        if (this.isImportRules && this.summaryView) {
            this.renderSummary();
        } else {
            if (this.columns.length && this.isImportRules) {
                this.addGroupElement(false, this.element, this.rule.condition);
                let mRules: RuleModel = extend({}, this.rule, {}, true);
                this.setGroupRules(mRules as RuleModel);
            } else if (this.columns.length) {
                this.addRuleElement(this.element.querySelector('.e-group-container'), {});
            }
            let buttons: NodeListOf<Element> = document.querySelectorAll('label.e-btn');
            let button: HTMLElement;
            for (let i: number = 0; i < buttons.length; i++) {
                button = buttons.item(i) as HTMLElement;
                rippleEffect(button, { selector: '.e-btn' });
            }
        }
    }
    private renderSummary(): void {
        let contentElem: Element = this.createElement('div', {
            attrs: {
                class: 'e-summary-content',
                id: this.element.id + '_summary_content'
            }
        });
        let textElem: Element =
        this.createElement('textarea', { attrs: { class: 'e-summary-text', readonly: 'true' }, styles: 'max-height:500px' });
        let editElem: Element = this.createElement('button', { attrs: { class: 'e-edit-rule e-css e-btn e-small e-flat e-primary' } });
        let divElem: Element = this.createElement('div', { attrs: { class: 'e-summary-btndiv' } });
        contentElem.appendChild(textElem);
        textElem.textContent = this.getSqlFromRules(this.rule);
        editElem.textContent = this.l10n.getConstant('Edit');
        divElem.appendChild(editElem);
        contentElem.appendChild(divElem);
        this.element.appendChild(contentElem);
    }
    private renderSummaryCollapse(): void {
        let collapseElem: Element = this.createElement('div', {
            attrs: {
                class: 'e-collapse-rule e-icons',
                title: this.l10n.getConstant('SummaryViewTitle')
            }
        });
        this.element.querySelector('.e-group-header').appendChild(collapseElem);
    }
    private columnSort(): void {
        if (this.sortDirection.toLowerCase() === 'descending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortByDesc('field'));
        } else if (this.sortDirection.toLowerCase() === 'ascending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortBy('field'));
        }
    }
    public onPropertyChanged(newProp: QueryBuilderModel, oldProp: QueryBuilderModel): void {
        let properties: string[] = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
                case 'summaryView':
                    let groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
                    let summaryElem: HTMLElement = this.element.querySelector('.e-summary-content') as HTMLElement;
                    if (newProp.summaryView) {
                        groupElem.style.display = 'none';
                        if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                            this.renderSummary();
                            summaryElem = this.element.querySelector('.e-summary-content') as HTMLElement;
                        } else {
                            this.element.querySelector('.e-summary-text').textContent = this.getSqlFromRules(this.rule);
                        }
                        summaryElem.style.display = 'block';
                    } else {
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
                    } else {
                        addClass(this.element.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
                        removeClass(this.element.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
                    }
                    break;
                case 'showButtons':
                    if (newProp.showButtons.ruleDelete) {
                        removeClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    } else {
                        addClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    }
                    if (newProp.showButtons.groupDelete) {
                        removeClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    } else {
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
                    } else {
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
    protected preRender(): void {
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
                { value: 'notin', key: this.l10n.getConstant('NotIn') }],
            dateOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }],
            booleanOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }],
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
                { value: 'notin', key: this.l10n.getConstant('NotIn') }],
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

    protected render(): void {
        this.levelColl = {};
        this.items = [
            {
                text: this.l10n.getConstant('AddGroup'),
                iconCss: 'e-icons e-add-icon e-addgroup'
            },
            {
                text: this.l10n.getConstant('AddCondition'),
                iconCss: 'e-icons e-add-icon e-addrule',
            }];
        this.ruleElem = this.ruleTemplate();
        this.groupElem = this.groupTemplate();
        if (this.dataSource instanceof DataManager) {
            this.dataManager = this.dataSource as DataManager;
            this.executeDataManager(new Query());
        } else {
            this.dataManager = new DataManager(this.dataSource as object[]);
            this.dataColl = this.dataManager.executeLocal(new Query());
            this.initControl();
        }
    }
    private executeDataManager(query: Query): void {
        let data: Promise<Object> = this.dataManager.executeQuery(query) as Promise<Object>;
        let deferred: Deferred = new Deferred();
        data.then((e: { result: Object[]}) => {
            this.dataColl = e.result;
            this.initControl();
        }).catch((e: ReturnType) => {
            deferred.reject(e);
        });
    }
    private initControl(): void {
        this.initialize();
        this.initWrapper();
        this.wireEvents();
    }
    protected wireEvents(): void {
        let wrapper: Element = this.getWrapper();
        EventHandler.add(wrapper, 'click', this.clickEventHandler, this);
    }
    protected unWireEvents(): void {
        let wrapper: Element = this.getWrapper();
        EventHandler.remove(wrapper, 'click', this.clickEventHandler);
    }
    private getGroup(target: Element, isParent?: boolean): RulesModel {
        let groupLevel: number[] = this.levelColl[target.id];
        let len: number = isParent ? groupLevel.length - 1 : groupLevel.length;
        let rule: RuleModel = this.rule;
        for (let i: number = 0; i < len; i++) {
            rule = this.findGroupByIdx(groupLevel[i], rule, i === 0);
        }
        return rule;
    }
    private deleteGroup(target: Element): void {
        let groupElem: Element = target;
        let groupId: string = groupElem.id;
        let rule: RuleModel = this.getGroup(groupElem, true);
        let index: number = 0; let i: number; let len: number;
        let args: { [key: string]: string | Element | boolean } = { groupID: groupId };
        this.trigger('groupDelete', args);
        let nextElem: Element = groupElem.nextElementSibling;
        let prevElem: Element = groupElem.previousElementSibling;
        let element: NodeListOf<Element> = groupElem.querySelectorAll('.e-group-container');
        let valElem: NodeListOf<Element> = target.querySelectorAll('.e-tooltip');
        len = valElem.length;
        for (i = 0; i < len; i++) {
            (getComponent(valElem[i] as HTMLElement, 'tooltip') as Tooltip).destroy();
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
    private deleteRule(target: Element): void {
        let groupElem: Element = closest(target, '.e-group-container');
        let rule: RuleModel = this.getGroup(groupElem);
        let ruleElem: Element = closest(target, '.e-rule-container');
        let clnruleElem: Element = ruleElem;
        let nextElem: Element = ruleElem.nextElementSibling;
        let prevElem: Element = ruleElem.previousElementSibling;
        let args: { [key: string]: string | Element | boolean } = { groupID: groupElem.id, ruleID: ruleElem.id };
        let index: number = 0;
        let valElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-tooltip');
        let i: number; let len: number = valElem.length;
        for (i = 0; i < len; i++) {
            (getComponent(valElem[i] as HTMLElement, 'tooltip') as Tooltip).destroy();
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
    private setGroupRules(rule: RuleModel): void {
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
    public setRules(rule: RuleModel): void {
        let mRules: RuleModel = extend({}, rule, {}, true);
        this.setGroupRules(mRules);
    }
    /**
     * Gets the rule or rule collection.
     * @returns object.
     */
    public getRules(): RuleModel {
        return this.rule;
    }
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    public deleteGroups(groupID: string[]): void {
        let i: number; let len: number = groupID.length;
        for (i = 0; i < len; i++) {
            this.deleteGroup(document.getElementById(groupID[i]));
        }
    }
    /**
     * Gets the predicate from collection of rules.
     * @returns object.
     */
    public getFilteredRecords(): object[] {
        let query: Query = new Query().where(this.getPredicate(this.rule));
        return new DataManager(this.dataSource).executeLocal(query);
    }

    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    public deleteRules(ruleID: string[]): void {
        let i: number; let len: number = ruleID.length;
        for (i = 0; i < len; i++) {
            this.deleteRule(document.getElementById(ruleID[i]));
        }
    }
    /**
     * Gets the query for Data Manager.
     * @returns string.
     */
    public getDataManagerQuery(rule: RuleModel): Query {
        let predicate: Predicate = this.getPredicate(rule);
        let query: Query; let fields: string[] = [];
        for (let i: number = 0, len: string[] = Object.keys(this.columns); i < len.length; i++) {
            fields.push(this.columns[i].field);
        }
        if (rule.rules.length) {
            query = new Query().select(fields).where(predicate);
        } else {
            query = new Query().select(fields);
        }
        return query;
    }
    /**   
     * Get the predicate from collection of rules.   
     * @returns null
     */
    public getPredicate(rule: RuleModel): Predicate {
        let ruleColl: RulesModel[] = rule.rules; let pred: Predicate; let pred2: Predicate; let date: Date;
        let ruleValue: string | number | Date; let matchCase: boolean = false; let column: ColumnsModel;
        for (let i: number = 0, len: number = ruleColl.length; i < len; i++) {
            let keys: string[] = Object.keys(ruleColl[i]);
            if (keys.indexOf('rules') > -1) {
                pred2 = this.getPredicate(ruleColl[i]);
                if (pred2) {
                    if (pred) {
                        if (rule.condition === 'and') {
                            pred = pred.and(pred2);
                        } else {
                            pred = pred.or(pred2);
                        }
                    } else {
                        pred = pred2;
                    }
                }
            } else if (ruleColl[i].operator.length) {
                let oper: string = ruleColl[i].operator.toLowerCase();
                let strOperColl: string[] = ['contains', 'startswith', 'endswith'];
                let dateOperColl: string[] = ['equal', 'notequal'];
                matchCase = (strOperColl.indexOf(oper) > -1 || (ruleColl[i].type === 'date' && dateOperColl.indexOf(oper) > -1));
                column = this.getColumn(ruleColl[i].field);
                if (ruleColl[i].type === 'date') {
                    let format: DateFormatOptions = { type: 'dateTime', format: column.format || 'MM/dd/yyyy' } as DateFormatOptions;
                    ruleValue = this.intl.parseDate(ruleColl[i].value as string, format) as Date;
                } else {
                    ruleValue = ruleColl[i].value as string | number;
                }
                if (i === 0) {
                    if ((oper.indexOf('in') > -1 || oper.indexOf('between') > -1) && oper !== 'contains') {
                        pred = this.arrayPredicate(ruleColl[i]);
                    } else {
                        let value: string | number | Date = ruleValue as string | number | Date;
                        if (value !== '') {
                            pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, matchCase);
                        }
                    }
                } else {
                    if (rule.condition === 'and') {
                        if ((oper.indexOf('in') > -1 || oper.indexOf('between') > -1) && oper !== 'contains') {
                            pred = this.arrayPredicate(ruleColl[i], pred, rule.condition);
                        } else {
                            let value: string | number | Date = ruleValue as string | number | Date;
                            if (pred && value !== '') {
                                pred = pred.and(ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, matchCase);
                            } else if (value !== '') {
                                pred = new Predicate(
                                    ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, matchCase);
                            }
                        }
                    } else {
                        if ((oper.indexOf('in') > -1 || oper.indexOf('between') > -1) && oper !== 'contains') {
                            pred = this.arrayPredicate(ruleColl[i], pred, rule.condition);
                        } else {
                            let value: string | number = ruleValue as string | number;
                            if (pred && value !== '') {
                                pred = pred.or(ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number, matchCase);
                            } else if (value !== '') {
                                pred = new Predicate(
                                    ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, matchCase);
                            }
                        }
                    }
                }
            }
        }
        return pred;
    }
    private getColumn(field: string): ColumnsModel {
        let columns: ColumnsModel[] = this.columns; let column: ColumnsModel;
        for (let i: number = 0, iLen: number = columns.length; i < iLen; i++) {
            if (columns[i].field === field) {
                column = columns[i];
            }
        }
        return column;
    }
    private arrayPredicate(ruleColl: RulesModel, predicate?: Predicate, condition?: string): Predicate {
        let value: number[] | string[] = ruleColl.value as number[] | string[];
        let pred: Predicate;
        for (let j: number = 0, jLen: number = value.length; j < jLen; j++) {
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
                } else {
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
                } else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            } else {
                predicate = pred;
            }
        }
        return predicate;
    }
    private importRules(rule: RuleModel, parentElem?: Element, isReset?: boolean): Element {
        if (!isReset) {
            parentElem = this.renderGroup(rule.condition, parentElem);
        }
        let ruleColl: RulesModel[] = rule.rules;
        for (let i: number = 0, len: number = ruleColl.length; i < len; i++) {
            let keys: string[] = Object.keys(ruleColl[i]);
            if (keys.indexOf('rules') > -1) {
                parentElem = this.renderGroup(ruleColl[i].condition, parentElem);
                parentElem = this.importRules(ruleColl[i], parentElem, true);
            } else {
                this.renderRule(ruleColl[i], parentElem);
            }
        }
        parentElem = closest(parentElem, '.e-rule-list');
        if (parentElem) {
            parentElem = closest(parentElem, '.e-group-container');
        }
        return parentElem;
    }
    private renderGroup(condition: string, parentElem?: Element): Element {
        this.addGroupElement(true, parentElem, condition); //Child group
        let element: NodeListOf<Element> = parentElem.querySelectorAll('.e-group-container');
        return element[element.length - 1];
    }
    private renderRule(rule: RulesModel, parentElem?: Element): void {
        if (parentElem.className.indexOf('e-group-container') > -1) {
            this.addRuleElement(parentElem, rule); //Create rule
        } else {
            this.addRuleElement(parentElem.querySelector('.e-group-container'), rule); //Create group
        }
    }
    private getSqlString(rules: RuleModel, queryStr?: string): string {
        let isRoot: boolean = false;
        if (!queryStr) {
            queryStr = '';
            isRoot = true;
        } else {
            queryStr += '(';
        }
        let condition: string = rules.condition;
        for (let j: number = 0, jLen: number = rules.rules.length; j < jLen; j++) {
            if (rules.rules[j].rules) {
                queryStr = this.getSqlString(rules.rules[j], queryStr);
            } else {
                let rule: RulesModel = rules.rules[j];
                let valueStr: string = '';
                if (rule.value instanceof Array) {
                    if (typeof rule.value[0] === 'string') {
                        valueStr += '("' + rule.value[0] + '"';
                        for (let k: number = 1, kLen: number = rule.value.length; k < kLen; k++) {
                            valueStr += ',"' + rule.value[k] + '"';
                        }
                        valueStr += ')';
                    } else {
                        valueStr += '(' + rule.value + ')';
                    }
                } else {
                    if (rule.operator === 'startswith') {
                        valueStr += '("' + rule.value + '%")';
                    } else if (rule.operator === 'endswith') {
                        valueStr += '("%' + rule.value + '")';
                    } else if (rule.operator === 'contains') {
                        valueStr += '("%' + rule.value + '%")';
                    } else {
                        if (rule.type === 'number') {
                            valueStr += rule.value;
                        } else {
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
    public setRulesFromSql(sqlString: string): void {
        let ruleModel: RuleModel = this.getRulesFromSql(sqlString);
        this.setRules({ condition: ruleModel.condition, rules: ruleModel.rules });
    }
    /**
     * Get the rules from SQL query.
     * @returns object.
     */
    public getRulesFromSql(sqlString: string): RuleModel {
        this.parser = [];
        this.sqlParser(sqlString);
        this.rule = { condition: '', rules: [] };
        return this.processParser(this.parser, this.rule, [0]);
    }
    /**
     * Gets the sql query from rules.
     * @returns object.
     */
    public getSqlFromRules(rule: RuleModel): string {
        return this.getSqlString(rule).replace(/"/g, '\'');
    }
    private sqlParser(sqlString: string): string[][] {
        let st: number = 0;
        let str: string;
        do {
            str = sqlString.slice(st);
            st += this.parseSqlStrings(str);
        } while (str !== '');
        return this.parser;
    }
    private parseSqlStrings(sqlString: string): number {
        let operators: string[] = ['=', '!=', '<', '>', '<=', '>='];
        let conditions: string[] = ['and', 'or'];
        let subOp: string[] = ['IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'BETWEEN', 'NOT BETWEEN'];
        let regexStr: string;
        let regex: RegExp;
        let matchValue: string;
        for (let i: number = 0, iLen: number = operators.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(operators[i]) ? '\\b' : '';
            regex = new RegExp('^(' + operators[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Operators', operators[i].toLowerCase()]);
                return operators[i].length;
            }
        }
        for (let i: number = 0, iLen: number = conditions.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(conditions[i]) ? '\\b' : '';
            regex = new RegExp('^(' + conditions[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Conditions', conditions[i].toLowerCase()]);
                return conditions[i].length;
            }
        }
        for (let i: number = 0, iLen: number = subOp.length; i < iLen; i++) {
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
    private getOperator(value: string, operator: string): string {
        let operators: object = {
            '=': 'equal', '!=': 'notequal', '<': 'lessthan', '>': 'greaterthan', '<=': 'lessthanorequal',
            '>=': 'greaterthanorequal', 'in': 'in', 'not in': 'notin', 'between': 'between', 'not between': 'notbetween'
        };
        if (value.indexOf('%') === 0 && value.indexOf('%') === value.length - 1) {
            return 'contains';
        } else if (value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
            return 'startswith';
        } else if (value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
            return 'endswith';
        }
        return operators[operator];
    }
    private processParser(parser: string[][], rules: RuleModel, levelColl: number[]): RuleModel {
        let rule: RulesModel;
        let numVal: number[] = [];
        let strVal: string[] = [];
        let subRules: RuleModel;
        let j: number; let jLen: number;
        let k: number; let kLen: number;
        let l: number; let lLen: number;
        let grpCount: number;
        let operator: string;
        for (let i: number = 0, iLen: number = parser.length; i < iLen; i++) {
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
                        } else {
                            if (operator === 'like' && parser[j][0] === 'String') {
                                rule.value = parser[j][1].replace(/'/g, '').replace(/%/g, '');
                                rule.type = 'string';
                            } else {
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                } else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                        }
                    }
                    if (operator !== 'like') {
                        if (parser[j - 1][0] === 'Number') {
                            rule.value = numVal;
                            rule.type = 'number';
                        } else if (parser[j - 1][0] === 'String') {
                            rule.value = strVal;
                            rule.type = 'string';
                        }
                    }
                } else if (parser[i + 1][0] === 'Operators') {
                    rule.operator = this.getOperator(parser[i + 2][1], parser[i + 1][1]);
                    if (parser[i + 2][0] === 'Number') {
                        rule.type = 'number';
                        rule.value = Number(parser[i + 2][1]);
                    } else {
                        rule.type = 'string';
                        rule.value = parser[i + 2][1].replace(/'/g, '');
                    }
                }
                rules.rules.push(rule);
            } else if (parser[i][0] === 'Left') {
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
            } else if (parser[i][0] === 'Conditions') {
                rules.condition = parser[i][1];
            } else if (parser[i][0] === 'Right') {
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
}

export interface Level {
    [key: string]: number[];
}

export interface TemplateColumn {
    /**
     * Creates the custom component.
     * @default null
     */
    create?: Element | Function | string;
    /**
     * Wire events for the custom component.
     * @default null
     */
    write?: void | Function | string;
    /**
     * Destroy the custom component.
     * @default null
     */
    destroy?: Function | string;
}
export interface Validation {
    /**
     * Specifies the minimum value in textbox validation.
     * @default 2
     */
    min?: number;
    /**
     * Specifies the maximum value in textbox validation.
     * @default 10
     */
    max?: number;
    /**
     * Specifies whether the value is required or not
     * @default true
     */
    isRequired: boolean;
}
